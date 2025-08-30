import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET, COOKIE_NAME } from '../config.js';

const createTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, { expiresIn: '10m' });
  // httpOnly cookie
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000 // 10 minutes
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, mobile, branch, gender, password } = req.body;
    if (!name || !email || !mobile || !branch || !gender || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, mobile, branch, gender, passwordHash });

    createTokenAndSetCookie(res, user._id);
    const safe = (({ _id,name,email,mobile,branch,gender,team,isLeader,createdAt })=>({ _id,name,email,mobile,branch,gender,team,isLeader,createdAt }))(user);
    res.status(201).json({ user: safe });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier = email or mobile
    if (!identifier || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ $or: [ { email: identifier }, { mobile: identifier } ] });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    createTokenAndSetCookie(res, user._id);
    const safe = (({ _id,name,email,mobile,branch,gender,team,isLeader,createdAt })=>({ _id,name,email,mobile,branch,gender,team,isLeader,createdAt }))(user);
    res.json({ user: safe });
  } catch (err) { next(err); }
};

export const logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  const user = req.user;
  res.json({ user });
};