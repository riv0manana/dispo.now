import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "../atoms/Button";
import { ResourceList, type Resource } from "./ResourceList";
import { ResourceForm } from "./ResourceForm";

interface ProjectResourceViewProps {
  resources: Resource[];
  isLoading: boolean;
  onCreateResource: (data: unknown) => void;
  onUpdateResource: (id: string, data: unknown) => void;
  onDeleteResource: (id: string) => void;
  isSubmitting: boolean;
  error?: string;
  onClearError: () => void;
  onResourceClick?: (id: string) => void;
}

export function ProjectResourceView({
  resources,
  isLoading,
  onCreateResource,
  onUpdateResource,
  onDeleteResource,
  isSubmitting,
  error,
  onClearError,
  onResourceClick
}: ProjectResourceViewProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  const handleCreate = () => {
    setEditingResource(null);
    setIsCreating(true);
    onClearError();
  };

  const handleEdit = (res: Resource) => {
    setEditingResource(res);
    setIsCreating(true);
    onClearError();
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingResource(null);
    onClearError();
  };

  const handleSubmit = (data: unknown) => {
    if (editingResource) {
      onUpdateResource(editingResource.id, data);
    } else {
      onCreateResource(data);
    }
    // Optimistic close - real app might wait for success, but props update will handle it if wired correctly
    // Actually better to let parent control close via success callback or prop change?
    // For now, let's keep local state control but respect isSubmitting
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Inventory</h2>
          <p className="text-zinc-400 text-sm">Manage your bookable assets.</p>
        </div>
        {!isCreating && (
          <Button 
            onClick={handleCreate}
            variant="primary"
            className="bg-white text-black hover:bg-zinc-200"
          >
            <Plus size={16} className="mr-2" />
            Create Resource
          </Button>
        )}
      </div>

      <AnimatePresence>
        {(isCreating || editingResource) && (
          <ResourceForm 
            mode={editingResource ? 'edit' : 'create'}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialData={editingResource as any}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
      </AnimatePresence>

      {isLoading ? (
         <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>
      ) : (
        <ResourceList 
          resources={resources}
          onEdit={handleEdit}
          onDelete={onDeleteResource}
          onCreate={handleCreate}
          onResourceClick={(res) => onResourceClick?.(res.id)}
        />
      )}
    </div>
  );
}
