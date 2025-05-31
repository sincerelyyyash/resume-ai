"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "../landing/MotionDiv";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Project {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  url?: string;
  technologies: string[];
}

interface Props {
  projects: Project[];
  showEdit: boolean;
  showAddNew: boolean;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const ProjectForm: React.FC<{
  data: Partial<Project>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Project>>>;
}> = ({ data, onChange, onSave, onCancel }) => {
  const [showDatePicker, setShowDatePicker] = useState({
    start: false,
    end: false
  });

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          {showDatePicker.start ? (
            <input
              name="startDate"
              type="date"
              value={data.startDate || ""}
              onChange={onChange}
              onBlur={() => setShowDatePicker(prev => ({ ...prev, start: false }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
            />
          ) : (
            <div
              onClick={() => setShowDatePicker(prev => ({ ...prev, start: true }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200"
            >
              {formatDate(data.startDate)}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          {showDatePicker.end ? (
            <input
              name="endDate"
              type="date"
              value={data.endDate || ""}
              onChange={onChange}
              onBlur={() => setShowDatePicker(prev => ({ ...prev, end: false }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
            />
          ) : (
            <div
              onClick={() => setShowDatePicker(prev => ({ ...prev, end: true }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200"
            >
              {formatDate(data.endDate) || 'Present'}
            </div>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project URL
        </label>
        <input
          name="url"
          placeholder="https://example.com"
          value={data.url || ""}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
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

const ProjectSection: React.FC<Props> = ({ projects, showEdit, showAddNew, onSave, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
    setAddingNew(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const projectData = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        url: formData.url,
        technologies: formData.technologies || [],
      };

      if (editingId) {
        await axios.put(`/api/user/projects`, {
          id: editingId,
          ...projectData,
        });
        toast({
          title: "Success",
          description: "Project updated successfully.",
        });
      } else {
        await axios.post(`/api/user/projects`, projectData);
        toast({
          title: "Success",
          description: "Project added successfully.",
        });
      }
      await onSave();
    resetForm();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/user/projects?id=${id}`);
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
      await onDelete();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MotionDiv className="mb-12 mx-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Projects</h2>
        {showAddNew && !addingNew && (
          <Button
            onClick={() => { setAddingNew(true); setFormData({}); }}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="relative p-6 bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700"
            >
              {editingId === project.id ? (
                <ProjectForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} setFormData={setFormData} />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {showEdit && (
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => {
                            if (project.id) {
                              setEditingId(project.id);
                              setFormData(project);
                            }
                          }}
                          variant="outline"
                          className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-4 py-2 rounded-lg text-sm"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => project.id && handleDelete(project.id)}
                          variant="outline"
                          className="border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 px-4 py-2 rounded-lg text-sm text-red-600 dark:text-red-400"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full">
                      {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : "Present"}
                    </span>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No projects added yet. Click the button above to add your first project.
          </div>
        )}

        {showAddNew && addingNew && (
          <div className="bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700">
            <ProjectForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} setFormData={setFormData} />
          </div>
        )}
      </div>
    </MotionDiv>
  );
};

export default ProjectSection;

