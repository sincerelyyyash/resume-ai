
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Project extends Document {
  name: string;
  technologies: string[];
  url: string;
  startDate: Date;
  endDate: Date;
  achievements: string[];
}

const ProjectSchema = new Schema<Project>({
  name: { type: String, required: true },
  technologies: { type: [String], required: true },
  url: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  achievements: { type: [String], required: true },
});

const ProjectModel: Model<Project> = mongoose.models.Project || mongoose.model<Project>('Project', ProjectSchema);

export default ProjectModel;
export { ProjectSchema };

