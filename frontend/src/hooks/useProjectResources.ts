import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/sdk";
import { useState } from "react";
import { type Resource } from "../components/ui/organisms/ResourceList";

export function useProjectResources(projectId?: string) {
  const queryClient = useQueryClient();
  const [createError, setCreateError] = useState("");

  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources', projectId],
    queryFn: () => projectId ? client.getResources({ projectId }) : Promise.resolve([]),
    enabled: !!projectId
  });

  const createResource = useMutation({
    mutationFn: async (params: unknown) => {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       return await client.createResource({ projectId: projectId! }, params as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', projectId] });
      setCreateError("");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCreateError((err as any).response?.data?.message || "Failed to create resource");
    }
  });

  const updateResource = useMutation({
    mutationFn: async (params: { id: string, data: unknown }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await client.updateResource(params.id, params.data as any, { projectId: projectId! });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', projectId] });
      setCreateError("");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCreateError((err as any).response?.data?.message || "Failed to update resource");
    }
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      return await client.deleteResource(id, { projectId: projectId! });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', projectId] });
    }
  });

  return {
    resources: (resources as Resource[]) || [],
    isLoading,
    createResource,
    updateResource,
    deleteResource,
    createError,
    setCreateError
  };
}
