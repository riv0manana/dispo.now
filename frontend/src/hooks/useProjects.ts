import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/sdk";
import { useState } from "react";
import { type Project } from "../components/ui/organisms/ProjectCard";

export function useProjects() {
  const queryClient = useQueryClient();
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
    }
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => client.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return {
    projects: (projects as Project[]) || [],
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    createError,
    setCreateError
  };
}
