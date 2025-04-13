
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
    <div className="space-y-3">
      <input
        name="title"
        placeholder="Title"
        value={data.title || ""}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-md placeholder-gray-500 text-black dark:text-white focus:border-black focus:outline-none"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={data.description || ""}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-md placeholder-gray-500 text-black dark:text-white focus:border-black focus:outline-none"
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
        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-md placeholder-gray-500 text-black dark:text-white focus:border-black focus:outline-none"
      />
      <input
        name="start_date"
        type="date"
        value={data.start_date || ""}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-zinc-700 p-2 rounded-md text-black dark:text-white bg-white dark:bg-zinc-900 focus:border-black focus:outline-none"
      />
      <input
        name="end_date"
        type="date"
        value={data.end_date || ""}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-zinc-700 p-2 rounded-md text-black dark:text-white bg-white dark:bg-zinc-900 focus:border-black focus:outline-none"
      />
      <input
        name="project_url"
        placeholder="Project URL"
        value={data.project_url || ""}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-md placeholder-gray-500 text-black dark:text-white focus:border-black focus:outline-none"
      />
      <div className="flex space-x-2">
        <Button onClick={onSave} className="bg-black text-white">Save</Button>
        <Button onClick={onCancel} variant="outline">Cancel</Button>
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
    <MotionDiv className="mb-6 mx-10">
      <h2 className="text-lg font-semibold mb-4 text-gray-600 dark:text-neutral-300">Projects</h2>

      {projects.map((proj) => (
        <div
          key={proj.id}
          className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-5 mb-5 shadow-md"
        >
          <div className="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400 italic">
            {new Date(proj.start_date).toLocaleDateString()} - {new Date(proj.end_date).toLocaleDateString()}
          </div>

          {editingId === proj.id ? (
            <ProjectForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
          ) : (
            <>
              <div className="flex items-center mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{proj.title}</h3>
                {proj.project_url && (
                  <a
                    href={proj.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-gray-100 mx-8 dark:bg-zinc-800 text-black dark:text-white rounded-md px-3 py-1 italic hover:underline"
                  >
                    Visit Project
                  </a>
                )}
              </div>


              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {proj.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 dark:bg-zinc-800 text-xs text-black dark:text-white px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300 mb-2">{proj.description}</p>

              {showEdit && (
                <div className="mt-4 space-x-2">
                  <Button
                    onClick={() => {
                      setEditingId(proj.id || null);
                      setFormData(proj);
                    }}
                    className="bg-black text-white"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => proj.id && onDelete(proj.id)}
                    className="bg-gray-800 text-white"
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
        <div className="bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-400 dark:border-zinc-700 p-5 rounded-md">
          {!addingNew ? (
            <Button onClick={() => { setAddingNew(true); setFormData({}); }} className="bg-black text-white">
              Add New
            </Button>
          ) : (
            <ProjectForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
          )}
        </div>
      )}
    </MotionDiv>
  );
};

export default ProjectSection;

