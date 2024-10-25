
import mongoose, { Schema, Document } from 'mongoose';

export interface JobDescription extends Document {
  title: string;
  description: string;
  requirements: string[];
  dateUploaded: Date;
}

const JobDescriptionSchema = new Schema<JobDescription>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String, required: true }],
  dateUploaded: { type: Date, default: Date.now },
});

export { JobDescriptionSchema };
export default mongoose.model<JobDescription>('JobDescription', JobDescriptionSchema);
