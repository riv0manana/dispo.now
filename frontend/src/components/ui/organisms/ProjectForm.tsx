import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { FormField } from "../molecules/FormField";

interface ProjectFormProps {
  mode: 'create' | 'edit';
  initialName?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function ProjectForm({ mode, initialName = "", onSubmit, onCancel, isSubmitting, error }: ProjectFormProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8 p-6 bg-[#161616] border border-zinc-800 rounded-xl"
    >
      <h3 className="text-lg font-medium text-white mb-4">
        {mode === 'create' ? 'Create New Project' : 'Edit Project'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Project Name" error={error}>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My SaaS App"
            autoFocus
          />
        </FormField>
        
        <div className="flex gap-3">
          <Button 
            type="submit" 
            isLoading={isSubmitting}
            variant="primary"
          >
            {mode === 'create' ? 'Create Project' : 'Save Changes'}
          </Button>
          <Button 
            type="button" 
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
