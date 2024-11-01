
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Education extends Document {
  institution: string;
  degree: string;
  startDate: Date;
  endDate: Date;
}

const EducationSchema = new Schema<Education>({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const EducationModel: Model<Education> = mongoose.models.Education || mongoose.model<Education>('Education', EducationSchema);

export default EducationModel;
export { EducationSchema };

