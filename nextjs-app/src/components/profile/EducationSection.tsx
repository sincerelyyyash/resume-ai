"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "../landing/MotionDiv";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  startDate?: string;
  endDate?: string;
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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
      <div className="grid grid-cols-2 gap-4">
        <input
          name="degree"
          placeholder="Degree (e.g., Bachelor's)"
          value={data.degree || ""}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
        />
        <input
          name="field"
          placeholder="Field of Study (e.g., Computer Science)"
          value={data.field || ""}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
        />
      </div>
      
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
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "start_date" || name === "end_date") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
    setAddingNew(false);
  };

  const handleSave = async () => {
    if (!formData.institution || !formData.degree || !formData.field || !formData.start_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const educationData = {
        institution: formData.institution,
        degree: formData.degree,
        field: formData.field,
        startDate: new Date(formData.start_date).toISOString(),
        endDate: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        current: !formData.end_date,
      };

      const isEdit = Boolean(editingId);
      let response;
      if (isEdit) {
        response = await axios.put("/api/user/education", { ...educationData, id: editingId });
      } else {
        response = await axios.post("/api/user/education", educationData);
      }
      
      if (response.data.success) {
        onSave(response.data.data, isEdit);
        resetForm();
        toast({
          title: isEdit ? "Education Updated" : "Education Added",
          description: `${formData.degree} at ${formData.institution} was ${isEdit ? "updated" : "added"} successfully.`,
        });
      } else {
        throw new Error(response.data.message || 'Failed to save education');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingId ? "update" : "add"} education.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/user/education?id=${id}`);
      onDelete(id);
      toast({
        title: "Education Deleted",
        description: "Education was deleted successfully.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to delete education.",
        variant: "destructive",
      });
    }
  };

  return (
    <MotionDiv className="mb-12 mx-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Education</h2>
        {showAddNew && (
          <Button
            onClick={() => setAddingNew(true)}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-6 py-2.5 rounded-lg font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {addingNew && (
          <EducationForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
        )}

        {education && education.length > 0 ? (
          education.map((edu) => (
            <div
              key={edu.id}
              className="relative p-6 bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {edu.field}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {edu.institution}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {(edu.startDate || edu.start_date) ? new Date(edu.startDate || edu.start_date || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''} - {(edu.endDate || edu.end_date) ? new Date(edu.endDate || edu.end_date || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Present'}
                  </div>
                </div>

                {editingId === edu.id ? (
                  <EducationForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
                ) : (
                  showEdit && (
                    <div className="flex justify-end space-x-3 mt-4">
                      <Button
                        onClick={() => {
                          if (edu.id) {
                            setEditingId(edu.id);
                            setFormData(edu);
                          }
                        }}
                        variant="outline"
                        className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-4 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => edu.id && handleDelete(edu.id)}
                        variant="outline"
                        className="border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 px-4 py-2 rounded-lg text-sm text-red-600 dark:text-red-400"
                      >
                        Delete
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No education added yet. Click the button above to add your first education.
          </div>
        )}
      </div>
    </MotionDiv>
  );
};

export default EducationSection; 