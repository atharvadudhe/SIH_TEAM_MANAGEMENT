import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  branch: { type: String, required: true },
  gender: { type: String, enum: ['male','female','other'], required: true },
  passwordHash: { type: String, required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  isLeader: { type: Boolean, default: false }
}, { timestamps: true });

export default model('User', userSchema);