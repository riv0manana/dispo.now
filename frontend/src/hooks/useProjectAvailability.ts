import { useQuery } from "@tanstack/react-query";
import { client } from "../lib/sdk";

export function useProjectAvailability(
  projectId?: string, 
  resourceId?: string, 
  date: Date = new Date(),
  slotDuration: number = 60,
  enabled: boolean = true
) {
  const { data: availabilitySlots, isLoading } = useQuery({
    queryKey: ['availability', projectId, resourceId, date, slotDuration],
    queryFn: async () => {
      if (!resourceId || !projectId) return [];

      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
      
      return await client.getAvailability(
        { projectId }, 
        resourceId, 
        start.toISOString(), 
        end.toISOString(),
        slotDuration
      );
    },
    enabled: !!projectId && !!resourceId && enabled
  });

  return {
    availabilitySlots: availabilitySlots || [],
    isLoading
  };
}
