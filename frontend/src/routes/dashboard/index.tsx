import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// Domain Hooks
import { useProjects } from "../../hooks/useProjects";

// Atomic Components
import { Button } from "../../components/ui/atoms/Button";
import { ProjectList } from "../../components/ui/organisms/ProjectList";
import { ProjectEmptyState } from "../../components/ui/organisms/ProjectEmptyState";
import { ProjectForm } from "../../components/ui/organisms/ProjectForm";
import { DashboardTemplate } from "../../components/templates/DashboardTemplate";

export function DashboardIndex() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<{ id: string, name: string } | null>(null);

  const {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    createError,
    setCreateError
  } = useProjects();

  if (isLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>;
  }

  const hasProjects = projects && projects.length > 0;

  return (
    <DashboardTemplate
      title="Projects"
      action={!isCreating && (
        <Button onClick={() => setIsCreating(true)} variant="primary" className="text-sm bg-white text-black hover:bg-zinc-200">
          <Plus size={16} className="mr-2" />
          New Project
        </Button>
      )}
      modal={
        <>
          <AnimatePresence>
            {isCreating && (
              <ProjectForm
                mode="create"
                onSubmit={(name) => {
                  createProject.mutate(name, {
                    onSuccess: () => setIsCreating(false)
                  });
                }}
                onCancel={() => {
                  setIsCreating(false);
                  setCreateError("");
                }}
                isSubmitting={createProject.isPending}
                error={createError}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {editingProject && (
              <ProjectForm
                mode="edit"
                initialName={editingProject.name}
                onSubmit={(name) => {
                  updateProject.mutate({ id: editingProject.id, name }, {
                    onSuccess: () => setEditingProject(null)
                  });
                }}
                onCancel={() => setEditingProject(null)}
                isSubmitting={updateProject.isPending}
              />
            )}
          </AnimatePresence>
        </>
      }
    >
      {!hasProjects && !isCreating ? (
        <ProjectEmptyState onCreate={() => setIsCreating(true)} />
      ) : (
        <ProjectList
          projects={projects}
          onEdit={(p) => setEditingProject(p)}
          onDelete={(id) => {
             if (confirm('Are you sure you want to delete this project?')) {
               deleteProject.mutate(id);
             }
          }}
        />
      )}
    </DashboardTemplate>
  );
}
