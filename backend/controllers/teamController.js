import Team from '../models/Team.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// GET /api/teams?theme=&q=
export const listTeams = async (req, res, next) => {
  try {
    const { theme, q } = req.query;
    const filter = {};
    if (theme) filter.theme = theme;
    if (q) filter.$or = [ { title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') } ];

    const teams = await Team.find(filter).populate('leader','name branch gender').populate('members','name branch gender');
    res.json({ teams });
  } catch (err) { next(err); }
};

export const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate('leader','name branch gender').populate('members','name branch gender');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json({ team });
  } catch (err) { next(err); }
};

export const createTeam = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, theme, description } = req.body;
    const user = await User.findById(req.user._id).session(session);
    if (!user) throw { status:400, message: 'User not found' };
    if (user.team) throw { status:400, message: 'You are already in a team' };

    // theme validation: naive - in seed we have themes; for v1 we accept any non-empty string
    if (!theme || !title) throw { status:400, message: 'Missing fields' };

    const team = await Team.create([{
      title, theme, description, leader: user._id, members: [user._id]
    }], { session });

    user.team = team[0]._id;
    user.isLeader = true;
    await user.save({ session });

    await session.commitTransaction();
    await team[0].populate('members','name branch gender');
    res.status(201).json({ team: team[0] });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally { session.endSession(); }
};

// PUT /api/teams/:id/join
export const joinTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.user.id;

    const team = await Team.findById(teamId).populate('members');
    if (!team) return res.status(404).json({ message: "Team not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // already in a team
    if (user.team) {
      return res.status(400).json({ message: "You are already in a team" });
    }

    // leader cannot join (they must create)
    if (user.isLeader) {
      return res.status(400).json({ message: "Leader cannot join another team" });
    }

    // check size
    if (team.members.length >= 6) {
      return res.status(400).json({ message: "Team is already full" });
    }

    // Check female requirement
    const hasFemale = team.members.some(m => m.gender === "female");

    if (!hasFemale) {
      if (team.members.length === 5 && user.gender !== "female") {
        return res.status(400).json({
          message: "The last slot must be filled by a female member"
        });
      }
    }

    // Add member
    team.members.push(user._id);
    await team.save();

    user.team = team._id;
    await user.save();

    res.status(200).json({ message: "Joined team successfully", team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const leaveTeam = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).session(session);
    if (!user || !user.team) throw { status:400, message: 'You are not in a team' };

    const team = await Team.findById(user.team).session(session).populate('members','gender');
    if (!team) throw { status:404, message: 'Team not found' };

    if (team.leader.toString() === userId.toString()) {
      throw { status:400, message: 'Leader cannot leave the team. Delete team or transfer leadership.' };
    }

    // remove user from members
    team.members = team.members.filter(m => m._id.toString() !== userId.toString());
    await team.save({ session });

    user.team = null;
    user.isLeader = false;
    await user.save({ session });

    // optional: if team.members.length === 0 then delete team
    if (team.members.length === 0) {
      await Team.deleteOne({ _id: team._id }).session(session);
    }

    await session.commitTransaction();
    res.json({ message: 'Left team' });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally { session.endSession(); }
};

export const deleteTeam = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;
    const team = await Team.findById(req.params.id).session(session);
    if (!team) throw { status:404, message: 'Team not found' };
    if (team.leader.toString() !== userId.toString()) throw { status:403, message: 'Only leader can delete' };

    // unset team for members
    await User.updateMany({ _id: { $in: team.members } }, { $set: { team: null, isLeader: false } }).session(session);
    await Team.deleteOne({ _id: team._id }).session(session);

    await session.commitTransaction();
    res.json({ message: 'Team deleted' });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally { session.endSession(); }
};