
import mongoose, { Schema, Document } from 'mongoose';

export interface Experience extends Document {
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  location: string;
}

const ExperienceSchema = new Schema<Experience>({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String, required: true },
  location: { type: String, required: true },
});

export { ExperienceSchema };
export default mongoose.model<Experience>('Experience', ExperienceSchema);
