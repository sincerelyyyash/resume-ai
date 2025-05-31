"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "../landing/MotionDiv";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Certification {
  id?: string;
  title: string;
  issuer: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

interface Props {
  certifications: Certification[];
  showEdit: boolean;
  showAddNew: boolean;
  onSave: (certification: Certification, isEdit: boolean) => void;
  onDelete: (id: string) => void;
}

const CertificationForm: React.FC<{
  data: Partial<Certification>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ data, onChange, onSave, onCancel }) => {
  const [showDatePicker, setShowDatePicker] = useState({
    issue: false,
    expiry: false
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
        placeholder="Certification Title"
        value={data.title || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <input
        name="issuer"
        placeholder="Issuing Organization"
        value={data.issuer || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <textarea
        name="description"
        placeholder="Certification Description"
        value={data.description || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200 min-h-[100px]"
      />
      <input
        name="credentialUrl"
        placeholder="Credential URL"
        value={data.credentialUrl || ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-zinc-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Issue Date
          </label>
          {showDatePicker.issue ? (
            <input
              name="issueDate"
              type="date"
              value={data.issueDate || ""}
              onChange={onChange}
              onBlur={() => setShowDatePicker(prev => ({ ...prev, issue: false }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
            />
          ) : (
            <div
              onClick={() => setShowDatePicker(prev => ({ ...prev, issue: true }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200"
            >
              {formatDate(data.issueDate)}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Expiry Date
          </label>
          {showDatePicker.expiry ? (
            <input
              name="expiryDate"
              type="date"
              value={data.expiryDate || ""}
              onChange={onChange}
              onBlur={() => setShowDatePicker(prev => ({ ...prev, expiry: false }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
            />
          ) : (
            <div
              onClick={() => setShowDatePicker(prev => ({ ...prev, expiry: true }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white cursor-pointer hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200"
            >
              {formatDate(data.expiryDate) || 'No Expiry'}
            </div>
          )}
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

const CertificationSection: React.FC<Props> = ({ certifications, showEdit, showAddNew, onSave, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<Certification>>({});
  const { toast } = useToast();

  console.log('Certifications:', certifications);

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
    if (!formData.title || !formData.issuer || !formData.issueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const certificationData = {
        title: formData.title,
        issuer: formData.issuer,
        description: formData.description,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || null,
        credentialUrl: formData.credentialUrl,
      };

      const isEdit = Boolean(editingId);
      let response;
      
      if (isEdit) {
        response = await axios.put("/api/user/certifications", { ...certificationData, id: editingId });
      } else {
        response = await axios.post("/api/user/certifications", certificationData);
      }

      if (response.data?.success) {
        console.log('Save response:', response.data);
        onSave(response.data.data, isEdit);
        resetForm();
        toast({
          title: isEdit ? "Certification Updated" : "Certification Added",
          description: `${formData.title} was ${isEdit ? "updated" : "added"} successfully.`,
        });
      } else {
        throw new Error(response.data?.error || "Failed to save certification");
      }
    } catch (error: unknown) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingId ? "update" : "add"} certification.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/user/certifications?id=${id}`);
      
      if (response.data?.success) {
        onDelete(id);
        toast({
          title: "Certification Deleted",
          description: "Certification was deleted successfully.",
        });
      } else {
        throw new Error(response.data?.error || "Failed to delete certification");
      }
    } catch (error: unknown) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete certification.",
        variant: "destructive",
      });
    }
  };

  return (
    <MotionDiv className="mb-12 mx-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Certifications</h2>
        {showAddNew && (
          <Button
            onClick={() => setAddingNew(true)}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-6 py-2.5 rounded-lg font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Cert.
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {addingNew && (
          <CertificationForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
        )}

        {certifications && certifications.length > 0 ? (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="relative p-6 bg-gradient-to-r from-zinc-800/20 to-zinc-700/20 shadow-lg shadow-zinc-600 hover:shadow-blue-500 rounded-2xl border border-zinc-700"
            >
              <div className="absolute top-6 right-6 text-sm text-gray-500 dark:text-gray-400">
                {new Date(cert.issueDate).toLocaleDateString()} - {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : "No Expiry"}
              </div>

              {editingId === cert.id ? (
                <CertificationForm data={formData} onChange={handleChange} onSave={handleSave} onCancel={resetForm} />
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{cert.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{cert.description}</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Issued by {cert.issuer}
                  </p>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                    >
                      View Credential
                    </a>
                  )}
                  {showEdit && (
                    <div className="absolute bottom-6 right-6 flex space-x-3">
                      <Button
                        onClick={() => {
                          if (cert.id) {
                            setEditingId(cert.id);
                            setFormData(cert);
                          }
                        }}
                        variant="outline"
                        className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-4 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => cert.id && handleDelete(cert.id)}
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
            No certifications added yet. Click the button above to add your first certification.
          </div>
        )}
      </div>
    </MotionDiv>
  );
};

export default CertificationSection; 