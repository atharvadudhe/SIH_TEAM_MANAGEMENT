import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const lookupSchema = new Schema({
  type: { type: String, enum: ['theme','branch'], required: true },
  value: { type: String, required: true }
});

export default model('Lookup', lookupSchema);