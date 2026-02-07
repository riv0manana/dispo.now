import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../lib/sdk";
import { useState } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { type Booking } from "../components/ui/organisms/BookingList";

export function useProjectBookings(projectId?: string, selectedResourceId?: string, viewDate: Date = new Date()) {
  const queryClient = useQueryClient();
  const [createError, setCreateError] = useState("");
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [isCreatingGroupBooking, setIsCreatingGroupBooking] = useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', projectId, selectedResourceId, viewDate],
    queryFn: async () => {
      if (!selectedResourceId || !projectId) return [];
      const start = startOfMonth(viewDate);
      const end = endOfMonth(viewDate);
      return await client.getBookings({ projectId }, selectedResourceId, start.toISOString(), end.toISOString());
    },
    enabled: !!projectId && !!selectedResourceId
  });

  const createBooking = useMutation({
    mutationFn: async (params: { start: string; end: string; quantity: number; notes?: string }) => {
      if (!projectId || !selectedResourceId) throw new Error("Missing project or resource");
      return await client.createBooking({ projectId }, { ...params, resourceId: selectedResourceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', projectId, selectedResourceId] });
      setIsCreatingBooking(false);
      setCreateError("");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCreateError((err as any).response?.data?.message || "Failed to create booking");
    }
  });

  const createGroupBooking = useMutation({
    mutationFn: async (bookings: Array<{ resourceId: string; start: string; end: string; quantity: number }>) => {
      if (!projectId) throw new Error("Missing project");
      return await client.createGroupBooking({ projectId, bookings }, { projectId });
    },
    onSuccess: () => {
      if (selectedResourceId) {
        queryClient.invalidateQueries({ queryKey: ['bookings', projectId, selectedResourceId] });
      }
      setIsCreatingGroupBooking(false);
      setCreateError("");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCreateError((err as any).response?.data?.message || "Failed to create group booking");
    }
  });

  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      if (!projectId) throw new Error("Missing project");
      return await client.cancelBooking(id, { projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', projectId, selectedResourceId] });
    }
  });

  return {
    bookings: (bookings as Booking[]) || [],
    isLoading,
    createBooking,
    createGroupBooking,
    cancelBooking,
    createError,
    setCreateError,
    isCreatingBooking,
    setIsCreatingBooking,
    isCreatingGroupBooking,
    setIsCreatingGroupBooking
  };
}
