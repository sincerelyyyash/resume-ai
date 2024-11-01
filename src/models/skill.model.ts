
import mongoose, { Schema, Document, Model } from 'mongoose';

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

const SkillModel: Model<Skill> = mongoose.models.Skill || mongoose.model<Skill>('Skill', SkillSchema);

export { SkillSchema, SkillLevel };
export default SkillModel;

