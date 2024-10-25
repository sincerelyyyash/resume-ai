
import mongoose, { Schema, Document } from 'mongoose';

export interface Project extends Document {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

const ProjectSchema = new Schema<Project>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  link: { type: String },
});

export { ProjectSchema };
export default mongoose.model<Project>('Project', ProjectSchema);
