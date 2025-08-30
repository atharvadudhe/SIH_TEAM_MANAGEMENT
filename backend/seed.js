import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGO_URI } from './config.js';
import Lookup from './models/Lookup.js';
import User from './models/User.js';
import Team from './models/Team.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const themes = ['Smart Automation', 'Fitness & Sports', 'Heritage & Culture', 'MedTech/BioTech/HealthTech', 'Agriculture/FoodTech/Rural Development', 'Smart Vehicles', 'Transportation & Logistics', 'Robotics & Drones', 'Clean & Green Technology', 'Tourism', 'Renewable/Sustainable Energy', 'Blockchain & Cybersecurity', 'Smart Education', 'Miscellaneous'];
const branches = [
 'Vishwashanti Sangeet Kala Academy (VSKA)',
 'School of Fine Arts and Applied Arts (SOFA)',
 'Institute of Design (IOD)',
 'School of Architecture (SOA)',
 'School of Computing (SOC)',
 'School of Engineering & Sciences (SOES)',
 'School of Education and Research (SOER)',
 'School of Vedic Sciences (SVS)',
 'School of Humanities (SOH)',
 'School of Indian Civil Services (SICS)',
 'MIT College of Management (MITCOM)',
 'Maharashtra Academy of Naval Education and Training (MANET)',
 'School of Food Technology (SoFT)',
 'School of Bioengineering Sciences and Research (SBSR)',
 'School of Film and Theatre (SFT)',
 'School of Law (SOL)'
];

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected');

  await Lookup.deleteMany({});
  await User.deleteMany({});
  await Team.deleteMany({});

  await Lookup.insertMany(themes.map(t=>({ type:'theme', value:t })));
  await Lookup.insertMany(branches.map(b=>({ type:'branch', value:b })));

  // create a leader user
  const pwd = await bcrypt.hash('password123', 10);
  const alice = await User.create({ name:'Alice', email:'alice@example.com', mobile:'9999999999', branch:'CSE', gender:'female', passwordHash:pwd });
  const bobPwd = await bcrypt.hash('password123', 10);
  const bob = await User.create({ name:'Bob', email:'bob@example.com', mobile:'8888888888', branch:'ECE', gender:'male', passwordHash:bobPwd });

  const team = await Team.create({ title: 'Team Alpha', theme: 'AI/ML', description:'Seed team', leader: alice._id, members: [alice._id] });
  alice.team = team._id; alice.isLeader = true; await alice.save();

  console.log('Seeded');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });