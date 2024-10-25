
import mongoose, { Schema, Document } from 'mongoose';
import { Project, ProjectSchema } from './project.model';
import { Experience, ExperienceSchema } from './experience.model';
import { Resume, ResumeSchema } from './resume.model';
import { JobDescription, JobDescriptionSchema } from './jobDescription.model';
import { Skill, SkillSchema } from './skill.model';

export interface UserDocument extends Document {
  email: string;
  name: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  projects: Project[];
  experiences: Experience[];
  savedResumes: Resume[];
  jobDescriptions: JobDescription[];
  skills: Skill[];
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bio: { type: String },
  linkedin: { type: String },
  github: { type: String },
  projects: [ProjectSchema],
  experiences: [ExperienceSchema],
  savedResumes: [ResumeSchema],
  jobDescriptions: [JobDescriptionSchema],
  skills: [SkillSchema],
});

export default mongoose.model<UserDocument>('User', UserSchema);

