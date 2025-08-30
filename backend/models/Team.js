import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const teamSchema = new Schema({
  title: { type: String, required: true },
  theme: { type: String, required: true },
  description: { type: String },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default model('Team', teamSchema);