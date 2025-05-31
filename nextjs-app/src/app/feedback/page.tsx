"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/text-area";
import {
  Select,
  SelectContent,
  SelectItem,   
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type FeedbackType = "bug" | "feature";

interface FeedbackForm {
  type: FeedbackType;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  email?: string;
}

export default function FeedbackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FeedbackForm>({
    type: "bug",
    title: "",
    description: "",
    priority: "medium",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will review it shortly.",
      });
      setFormData({
        type: "bug",
        title: "",
        description: "",
        priority: "medium",
        email: "",
      });
    } catch (error) {
      toast({
        title: "Failed to submit feedback",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6">Feedback & Support</h1>
      <p className="text-gray-600 mb-8">
        Help us improve by reporting bugs or suggesting new features. Your feedback is valuable to us!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={formData.type}
            onValueChange={(value: FeedbackType) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Brief description of the issue or feature"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <TextArea
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Please provide detailed information about the bug or feature request"
            required
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select
            value={formData.priority}
            onValueChange={(value: "low" | "medium" | "high") =>
              setFormData({ ...formData, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contact Email (Optional)</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Your email address"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </div>
  );
} 