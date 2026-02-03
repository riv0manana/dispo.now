import { Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../lib/sdk";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// Atomic Components
import { Button } from "../../components/ui/atoms/Button";
import { ProjectList } from "../../components/ui/organisms/ProjectList";
import { ProjectEmptyState } from "../../components/ui/organisms/ProjectEmptyState";
import { ProjectForm } from "../../components/ui/organisms/ProjectForm";
import { DashboardTemplate } from "../../components/templates/DashboardTemplate";
import { type Project } from "../../components/ui/organisms/ProjectCard";

export function DashboardIndex() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<{ id: string, name: string } | null>(null);
  const [createError, setCreateError] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => client.getProjects()
  });

  const createProject = useMutation({
    mutationFn: async (name: string) => {
      return await client.createProject(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreating(false);
      setCreateError("");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCreateError((err as any).response?.data?.message || "Failed to create project");
    }
  });

  const updateProject = useMutation({
    mutationFn: ({ id, name }: { id: string, name: string }) => 
      client.updateProject(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditingProject(null);
    }
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => client.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

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
                onSubmit={(name) => createProject.mutate(name)}
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
                onSubmit={(name) => updateProject.mutate({ id: editingProject.id, name })}
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
          projects={projects as Project[]}
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
