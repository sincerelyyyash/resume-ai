
import mongoose, { Schema, Document } from 'mongoose';

export interface Resume extends Document {
  jobDescriptionId: string;
  url: string;
  createdAt: Date;
}

const ResumeSchema = new Schema<Resume>({
  jobDescriptionId: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export { ResumeSchema };
export default mongoose.model<Resume>('Resume', ResumeSchema);
