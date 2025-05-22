"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MotionDiv from "../motion-div";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
interface Experience {
  id?: string;
  company: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
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
    <div className="space-y-4 p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-zinc-800">
      <input
        name="company"
        placeholder="Company Name"
        value={data.company || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <input
        name="title"
        placeholder="Job Title"
        value={data.title || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <textarea
        name="description"
        placeholder="Job Description"
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
      <input
        name="location"
        placeholder="Location"
        value={data.location || ""}
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

const ExperienceSection: React.FC<Props> = ({ experiences, showEdit, showAddNew, onSave, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Experience>>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "technologies") {
      setFormData((prev) => ({ ...prev, technologies: value.split(",").map((t) => t.trim()) }));
    } else if (name === "start_date" || name === "end_date") {
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
    if (!formData.title || !formData.company || !formData.start_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const experienceData = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        startDate: new Date(formData.start_date).toISOString(),
        endDate: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        location: formData.location,
        technologies: formData.technologies,
        current: !formData.end_date,
      };

      const isEdit = Boolean(editingId);
      let response;
      if (isEdit) {
        response = await axios.put("/api/user/experiences", { ...experienceData, id: editingId });
      } else {
        response = await axios.post("/api/user/experiences", experienceData);
      }
      
      if (response.data.success) {
        onSave(response.data.data, isEdit);
        resetForm();
        toast({
          title: isEdit ? "Experience Updated" : "Experience Added",
          description: `${formData.title} was ${isEdit ? "updated" : "added"} successfully.`,
        });
      } else {
        throw new Error(response.data.message || 'Failed to save experience');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingId ? "update" : "add"} experience.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/user/experiences?id=${id}`);
      onDelete(id);
      toast({
        title: "Experience Deleted",
        description: "Experience was deleted successfully.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to delete experience.",
        variant: "destructive",
      });
    }
  };

  return (
    <MotionDiv className="mb-12 mx-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Experience</h2>
        {showAddNew && (
          <Button
            onClick={() => setAddingNew(true)}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-6 py-2.5 rounded-lg font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {experiences && experiences.length > 0 ? (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="relative p-6 bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700"
            >
              <div className="absolute top-6 right-6 text-sm text-gray-500 dark:text-gray-400">
                {(exp.startDate || exp.start_date) ? new Date(exp.startDate || exp.start_date || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''} - {(exp.endDate || exp.end_date) ? new Date(exp.endDate || exp.end_date || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Present'}
              </div>

              {editingId === exp.id ? (
                <ExperienceForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{exp.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {exp.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {exp.company} - {exp.location}
                  </p>
                  {showEdit && (
                    <div className="absolute bottom-6 right-6 flex space-x-3">
                      <Button
                        onClick={() => {
                          if (exp.id) {
                            setEditingId(exp.id);
                            setFormData(exp);
                          }
                        }}
                        variant="outline"
                        className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-4 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => exp.id && handleDelete(exp.id)}
                        variant="outline"
                        className="border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 px-4 py-2 rounded-lg text-sm text-red-600 dark:text-red-400"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No experiences added yet. Click the button above to add your first experience.
          </div>
        )}

        {showAddNew && addingNew && (
          <ExperienceForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
        )}
      </div>
    </MotionDiv>
  );
};

export default ExperienceSection;
