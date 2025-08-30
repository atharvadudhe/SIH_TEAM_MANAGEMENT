import Lookup from '../models/Lookup.js';

export const getThemes = async (req, res, next) => {
  try {
    const themes = await Lookup.find({ type: 'theme' }).select('value -_id');
    res.json({ themes: themes.map(t=>t.value) });
  } catch (err) { next(err); }
};

export const getBranches = async (req, res, next) => {
  try {
    const branches = await Lookup.find({ type: 'branch' }).select('value -_id');
    res.json({ branches: branches.map(b=>b.value) });
  } catch (err) { next(err); }
};