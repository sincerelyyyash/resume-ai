
import mongoose, { Schema, Document, Model } from 'mongoose';

enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
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
  level: {
    type: String,
    enum: Object.values(SkillLevel),
    default: SkillLevel.Beginner,
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0,
  },
});

const SkillModel: Model<Skill> = mongoose.models.Skill || mongoose.model<Skill>('Skill', SkillSchema);

export { SkillSchema, SkillLevel };
export default SkillModel;

