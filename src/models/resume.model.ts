
import mongoose, { Schema, Document, Model } from 'mongoose';

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

const ResumeModel: Model<Resume> = mongoose.models.Resume || mongoose.model<Resume>('Resume', ResumeSchema);

export default ResumeModel;
export { ResumeSchema };

