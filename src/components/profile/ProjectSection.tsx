"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MotionDiv from "../motion-div";

interface Project {
  id?: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  project_url: string;
  technologies?: string[];
}

interface Props {
  projects: Project[];
  showEdit: boolean;
  showAddNew: boolean;
  onSave: (project: Project, isEdit: boolean) => void;
  onDelete: (id: string) => void;
}

const ProjectForm: React.FC<{
  data: Partial<Project>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  return (
    <div className="space-y-4 p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-800">
      <input
        name="title"
        placeholder="Project Title"
        value={data.title || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <textarea
        name="description"
        placeholder="Project Description"
        value={data.description || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200 min-h-[100px]"
      />
      <input
        name="technologies"
        placeholder="Technologies (comma separated)"
        value={Array.isArray(data.technologies) ? data.technologies.join(", ") : ""}
        onChange={(e) =>
          onChange({
            ...e,
            target: {
              ...e.target,
              name: "technologies",
              value: e.target.value,
            },
          })
        }
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          name="start_date"
          type="date"
          value={data.start_date || ""}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
        />
        <input
          name="end_date"
          type="date"
          value={data.end_date || ""}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
        />
      </div>
      <input
        name="project_url"
        placeholder="Project URL"
        value={data.project_url || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <div className="flex space-x-3 pt-4">
        <Button 
          onClick={onSave} 
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-6 py-2.5 rounded-lg font-medium"
        >
          Save
        </Button>
        <Button 
          onClick={onCancel} 
          variant="outline"
          className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-6 py-2.5 rounded-lg font-medium"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

const ProjectSection: React.FC<Props> = ({ projects, showEdit, showAddNew, onSave, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "technologies") {
      setFormData((prev) => ({ ...prev, technologies: value.split(",").map((t) => t.trim()) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
    setAddingNew(false);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.start_date || !formData.end_date) return;
    onSave(formData as Project, Boolean(editingId));
    resetForm();
  };

  return (
    <MotionDiv className="mb-12 mx-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Projects</h2>

      <div className="space-y-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="absolute top-16 right-6 text-sm text-gray-500 dark:text-gray-400">
              {new Date(proj.start_date).toLocaleDateString()} - {new Date(proj.end_date).toLocaleDateString()}
            </div>

            {editingId === proj.id ? (
              <ProjectForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{proj.title}</h3>
                  {proj.project_url && (
                    <a
                      href={proj.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-1.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200"
                    >
                      View Project
                    </a>
                  )}
                </div>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{proj.description}</p>

                {showEdit && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setEditingId(proj.id || null);
                        setFormData(proj);
                      }}
                      className="bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 px-4 py-2 rounded-lg"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => proj.id && onDelete(proj.id)}
                      className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {showAddNew && (
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-6 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors duration-200">
            {!addingNew ? (
              <Button 
                onClick={() => { setAddingNew(true); setFormData({}); }} 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-6 py-2.5 rounded-lg font-medium"
              >
                Add New Project
              </Button>
            ) : (
              <ProjectForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
            )}
          </div>
        )}
      </div>
    </MotionDiv>
  );
};

export default ProjectSection;

