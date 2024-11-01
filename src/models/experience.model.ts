
import mongoose, { Schema, Document, Model } from 'mongoose';

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

const ExperienceModel: Model<Experience> = mongoose.models.Experience || mongoose.model<Experience>('Experience', ExperienceSchema);

export default ExperienceModel;
export { ExperienceSchema };

