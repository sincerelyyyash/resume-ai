
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MotionDiv from "../motion-div";

interface Experience {
  id?: string;
  company: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  technologies?: string[];
}

interface Props {
  experiences: Experience[];
  showEdit: boolean;
  showAddNew: boolean;
  onSave: (experience: Experience, isEdit: boolean) => void;
  onDelete: (id: string) => void;
}

const ExperienceForm: React.FC<{
  data: Partial<Experience>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  return (
    <div className="space-y-3">
      <input
        name="company"
        placeholder="Company"
        value={data.company || ""}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-md placeholder-gray-500 text-black dark:text-white focus:border-black focus:outline-none"
      />
      <input
        name="title"
        placeholder="Title/Position"
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
        name="location"
        placeholder="Location"
        value={data.location || ""}
        onChange={onChange}
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
      <div className="flex space-x-2">
        <Button onClick={onSave} className="bg-black text-white">Save</Button>
        <Button onClick={onCancel} variant="outline">Cancel</Button>
      </div>
    </div>
  );
};

const ExperienceSection: React.FC<Props> = ({ experiences, showEdit, showAddNew, onSave, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Experience>>({});

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
    if (!formData.title || !formData.company || !formData.start_date || !formData.end_date) return;
    onSave(formData as Experience, Boolean(editingId));
    resetForm();
  };

  return (
    <MotionDiv className="mb-6 mx-10">
      <h2 className="text-lg font-semibold mb-4 text-gray-600 dark:text-neutral-300">Experience</h2>

      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="relative bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-5 mb-5 shadow-md"
        >
          <div className="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400 italic">
            {new Date(exp.start_date).toLocaleDateString()} - {new Date(exp.end_date).toLocaleDateString()}
          </div>

          {editingId === exp.id ? (
            <ExperienceForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.title} @ {exp.company}</h3>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exp.location}</p>

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {exp.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 dark:bg-zinc-800 text-xs text-black dark:text-white px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300 mb-2">{exp.description}</p>

              {showEdit && (
                <div className="mt-4 space-x-2">
                  <Button
                    onClick={() => {
                      setEditingId(exp.id || null);
                      setFormData(exp);
                    }}
                    className="bg-black text-white"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => exp.id && onDelete(exp.id)}
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
            <ExperienceForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
          )}
        </div>
      )}
    </MotionDiv>
  );
};

export default ExperienceSection;
