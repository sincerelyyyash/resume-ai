"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "../landing/MotionDiv";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";

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
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const SkillForm: React.FC<{
  data: Partial<Skill>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  return (
    <div className="space-y-4 p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Skill Name
          </label>
      <input
        name="name"
            placeholder="e.g., React, Python"
        value={data.name || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
      <input
        name="category"
            placeholder="e.g., Frontend, Backend"
        value={data.category || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Skill Level
          </label>
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Years of Experience
          </label>
      <input
        name="yearsOfExperience"
        type="number"
            placeholder="e.g., 2"
        value={data.yearsOfExperience || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
        </div>
      </div>
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
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
    setAddingNew(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.level) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/user/skills`, {
          id: editingId,
          name: formData.name,
          category: formData.category,
          level: formData.level,
          yearsOfExperience: formData.yearsOfExperience,
        });
        toast({
          title: "Success",
          description: "Skill updated successfully.",
        });
      } else {
        await axios.post(`/api/user/skills`, {
          name: formData.name,
          category: formData.category,
          level: formData.level,
          yearsOfExperience: formData.yearsOfExperience,
        });
        toast({
          title: "Success",
          description: "Skill added successfully.",
        });
      }
      await onSave();
    resetForm();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/user/skills?id=${id}`);
      toast({
        title: "Success",
        description: "Skill deleted successfully.",
      });
      await onDelete();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MotionDiv className="mb-12 mx-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Skills</h2>
        {showAddNew && !addingNew && (
          <Button
            onClick={() => { setAddingNew(true); setFormData({}); }}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {skills && skills.length > 0 ? (
          skills.map((skill) => (
            <div
              key={skill.id}
              className="relative p-6 bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700"
            >
              {editingId === skill.id ? (
                <SkillForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{skill.name}</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{skill.category}</span>
                    </div>
                    {showEdit && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            if (skill.id) {
                              setEditingId(skill.id);
                              setFormData(skill);
                            }
                          }}
                          variant="outline"
                          className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-4 py-2 rounded-lg text-sm"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => skill.id && handleDelete(skill.id)}
                          variant="outline"
                          className="border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 px-4 py-2 rounded-lg text-sm text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">
                      {skill.level}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">
                      {skill.yearsOfExperience} years
                    </span>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No skills added yet. Click the button above to add your first skill.
          </div>
        )}

        {showAddNew && addingNew && (
          <div className="bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700">
            <SkillForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
          </div>
        )}
      </div>
    </MotionDiv>
  );
};

export default SkillsSection; 