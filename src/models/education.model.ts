
import mongoose, { Schema, Document } from 'mongoose';

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

export default mongoose.model<Education>('Education', EducationSchema);
export { EducationSchema };
