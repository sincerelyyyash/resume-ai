"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MotionDiv from "../motion-div";

interface Education {
  id?: string;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string;
}

interface Props {
  education: Education[];
  showEdit: boolean;
  showAddNew: boolean;
  onSave: (education: Education, isEdit: boolean) => void;
  onDelete: (id: string) => void;
}

const EducationForm: React.FC<{
  data: Partial<Education>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  return (
    <div className="space-y-4 p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-800">
      <input
        name="institution"
        placeholder="Institution Name"
        value={data.institution || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <input
        name="degree"
        placeholder="Degree"
        value={data.degree || ""}
        onChange={onChange}
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

const EducationSection: React.FC<Props> = ({ education, showEdit, showAddNew, onSave, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Education>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
    setAddingNew(false);
  };

  const handleSave = () => {
    if (!formData.institution || !formData.degree || !formData.start_date || !formData.end_date) return;
    onSave(formData as Education, Boolean(editingId));
    resetForm();
  };

  return (
    <MotionDiv className="mb-12 mx-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Education</h2>

      <div className="space-y-6">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="relative p-6 bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700"
          >
            <div className="absolute top-16 right-6 text-sm text-gray-500 dark:text-gray-400">
              {new Date(edu.start_date).toLocaleDateString()} - {new Date(edu.end_date).toLocaleDateString()}
            </div>

            {editingId === edu.id ? (
              <EducationForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                  <span className="text-sm bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-1">
                    {edu.institution}
                  </span>
                </div>

                {showEdit && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => {
                        setEditingId(edu.id || null);
                        setFormData(edu);
                      }}
                      className="bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200 px-4 py-2 rounded-lg"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => edu.id && onDelete(edu.id)}
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
                Add New Education
              </Button>
            ) : (
              <EducationForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
            )}
          </div>
        )}
      </div>
    </MotionDiv>
  );
};

export default EducationSection; 