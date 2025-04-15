"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MotionDiv from "../motion-div";

interface Skill {
  id?: string;
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsOfExperience: number;
}

interface Props {
  skills: Skill[];
  showEdit: boolean;
  showAddNew: boolean;
  onSave: (skill: Skill, isEdit: boolean) => void;
  onDelete: (id: string) => void;
}

const SkillForm: React.FC<{
  data: Partial<Skill>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  return (
    <div className="space-y-4 p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-800">
      <input
        name="name"
        placeholder="Skill Name"
        value={data.name || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <input
        name="category"
        placeholder="Category"
        value={data.category || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <select
        name="level"
        value={data.level || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      >
        <option value="">Select Level</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Expert">Expert</option>
      </select>
      <input
        name="yearsOfExperience"
        type="number"
        placeholder="Years of Experience"
        value={data.yearsOfExperience || ""}
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

const SkillsSection: React.FC<Props> = ({ skills, showEdit, showAddNew, onSave, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Skill>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
    setAddingNew(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category || !formData.level) return;
    onSave(formData as Skill, Boolean(editingId));
    resetForm();
  };

  return (
    <MotionDiv className="mb-12 mx-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Skills</h2>

      <div className="space-y-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="relative bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {editingId === skill.id ? (
              <SkillForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{skill.name}</h3>
                  <span className="text-sm bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-1">
                    {skill.category}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Level: {skill.level}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Experience: {skill.yearsOfExperience} years
                  </span>
                </div>

                {showEdit && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setEditingId(skill.id || null);
                        setFormData(skill);
                      }}
                      className="bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 px-4 py-2 rounded-lg"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => skill.id && onDelete(skill.id)}
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
                Add New Skill
              </Button>
            ) : (
              <SkillForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
            )}
          </div>
        )}
      </div>
    </MotionDiv>
  );
};

export default SkillsSection; 