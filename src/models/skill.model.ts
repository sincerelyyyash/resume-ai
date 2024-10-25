
import mongoose, { Schema, Document } from 'mongoose';

enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
  Master = 'Master',
}

export interface Skill extends Document {
  name: string;
  category: string;
  level?: SkillLevel;
  yearsOfExperience?: number;
}

const SkillSchema = new Schema<Skill>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: Object.values(SkillLevel) },
  yearsOfExperience: { type: Number },
});

export { SkillSchema, SkillLevel };
export default mongoose.model<Skill>('Skill', SkillSchema);


