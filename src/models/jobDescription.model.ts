
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface JobDescription extends Document {
  title: string;
  description: string;
  requirements: string[];
  dateUploaded: Date;
}

const JobDescriptionSchema = new Schema<JobDescription>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // requirements: [{ type: String, required: true }],
  dateUploaded: { type: Date, default: Date.now },
});

const JobDescriptionModel: Model<JobDescription> = mongoose.models.JobDescription || mongoose.model<JobDescription>('JobDescription', JobDescriptionSchema);

export default JobDescriptionModel;
export { JobDescriptionSchema };

