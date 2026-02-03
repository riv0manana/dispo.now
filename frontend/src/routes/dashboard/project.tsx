import { useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../lib/sdk";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { startOfMonth, endOfMonth } from "date-fns";

// Atomic Components
import { Button } from "../../components/ui/atoms/Button";
import { Select } from "../../components/ui/atoms/Select";
import { ResourceList, type Resource } from "../../components/ui/organisms/ResourceList";
import { BookingList, type Booking } from "../../components/ui/organisms/BookingList";
import { ResourceForm } from "../../components/ui/organisms/ResourceForm";
import { BookingCreationPanel } from "../../components/ui/organisms/BookingCreationPanel";
import { GroupBookingCreationPanel } from "../../components/ui/organisms/GroupBookingCreationPanel";
import { ProjectDetailTemplate } from "../../components/templates/ProjectDetailTemplate";
import { AvailabilityViewer } from "../../components/ui/organisms/AvailabilityViewer";

export function ProjectDetailRoute() {
  const { projectId } = useParams({ from: '/dashboard/$projectId' });
  const queryClient = useQueryClient();
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'resources' | 'bookings' | 'availability'>('resources');

  // Resource Form State
  const [isCreatingResource, setIsCreatingResource] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [createError, setCreateError] = useState("");

  // Bookings State
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const [viewDate, setViewDate] = useState(new Date());
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [isCreatingGroupBooking, setIsCreatingGroupBooking] = useState(false);
  const [createBookingError, setCreateBookingError] = useState("");

  // Availability State
  const [availabilityDate, setAvailabilityDate] = useState(new Date());

  // --- Queries ---

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => client.getProjects()
  });
  const project = projects?.find(p => p.id === projectId);

  const { data: resources, isLoading: isLoadingResources } = useQuery({
    queryKey: ['resources', projectId],
    queryFn: () => projectId ? client.getResources({ projectId }) : Promise.resolve([]),
    enabled: !!projectId
  });

  const selectedResource = resources?.find(r => r.id === selectedResourceId);

  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings', projectId, selectedResourceId, viewDate],
    queryFn: async () => {
      if (!selectedResourceId || !projectId) return [];
      const start = startOfMonth(viewDate);
      const end = endOfMonth(viewDate);
      return await client.getBookings({ projectId }, selectedResourceId, start.toISOString(), end.toISOString());
    },
    enabled: !!projectId && !!selectedResourceId && activeTab === 'bookings'
  });

  const { data: availabilitySlots, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['availability', projectId, selectedResourceId, availabilityDate],
    queryFn: async () => {
      if (!selectedResourceId || !projectId) return [];
      // Set to beginning of day
      const start = new Date(availabilityDate);
      start.setHours(0, 0, 0, 0);
      
      // Set to end of day
      const end = new Date(availabilityDate);
      end.setHours(23, 59, 59, 999);
      
      return await client.getAvailability(
        { projectId }, 
        selectedResourceId, 
        start.toISOString(), 
        end.toISOString(),
        60 // 1 hour slots
      );
    },
    enabled: !!projectId && !!selectedResourceId && activeTab === 'availability'
  });

  // --- Mutations ---

  const createResource = useMutation({
    mutationFn: async (params: unknown) => {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       return await client.createResource({ projectId }, params as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', projectId] });
      setIsCreatingResource(false);
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
      return await client.updateResource(params.id, params.data as any, { projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', projectId] });
      setEditingResource(null);
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
      return await client.deleteResource(id, { projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', projectId] });
    }
  });

  const createBooking = useMutation({
    mutationFn: async (params: { start: string; end: string; quantity: number; notes?: string }) => {
      return await client.createBooking({ projectId }, { ...params, resourceId: selectedResourceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', projectId, selectedResourceId] });
      setIsCreatingBooking(false);
      setCreateBookingError("");
      // Force refresh of the view date to ensure calendar re-renders if needed
      setViewDate(new Date(viewDate));
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCreateBookingError((err as any).response?.data?.message || "Failed to create booking");
    }
  });

  const createGroupBooking = useMutation({
    mutationFn: async (bookings: Array<{ resourceId: string; start: string; end: string; quantity: number }>) => {
      return await client.createGroupBooking({ projectId, bookings }, { projectId });
    },
    onSuccess: () => {
      if (selectedResourceId) {
        queryClient.invalidateQueries({ queryKey: ['bookings', projectId, selectedResourceId] });
      }
      setIsCreatingGroupBooking(false);
      setCreateBookingError("");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setCreateBookingError((err as any).response?.data?.message || "Failed to create group booking");
    }
  });

  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      return await client.cancelBooking(id, { projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', projectId, selectedResourceId] });
    }
  });

  // --- Render Helpers ---

  if (!project) return <div className="p-8 text-zinc-400">Project not found or loading...</div>;

  return (
    <ProjectDetailTemplate
      project={project}
      tabs={
        <div className="flex gap-6 border-b border-zinc-800 mb-8">
          <button 
            onClick={() => setActiveTab('resources')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'resources' 
                ? 'border-emerald-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Resources
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'bookings' 
                ? 'border-emerald-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Bookings
          </button>
          <button 
            onClick={() => setActiveTab('availability')}
            className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'availability' 
                ? 'border-emerald-500 text-white' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Availability
          </button>
        </div>
      }
    >
      {activeTab === 'resources' ? (
        // Resources Tab
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Inventory</h2>
              <p className="text-zinc-400 text-sm">Manage your bookable assets.</p>
            </div>
            {!isCreatingResource && (
              <Button 
                onClick={() => {
                  setEditingResource(null);
                  setIsCreatingResource(true);
                }}
                variant="primary"
                className="bg-white text-black hover:bg-zinc-200"
              >
                <Plus size={16} className="mr-2" />
                Create Resource
              </Button>
            )}
          </div>

          <AnimatePresence>
            {(isCreatingResource || editingResource) && (
              <ResourceForm 
                mode={editingResource ? 'edit' : 'create'}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                initialData={editingResource as any}
                onSubmit={(data) => {
                  if (editingResource) {
                    updateResource.mutate({ id: editingResource.id, data });
                  } else {
                    createResource.mutate(data);
                  }
                }}
                onCancel={() => {
                  setIsCreatingResource(false);
                  setEditingResource(null);
                  setCreateError("");
                }}
                isSubmitting={createResource.isPending || updateResource.isPending}
                error={createError}
              />
            )}
          </AnimatePresence>

          {isLoadingResources ? (
             <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>
          ) : (
            <ResourceList 
              resources={resources as Resource[]}
              onEdit={(res) => {
                setEditingResource(res);
                setIsCreatingResource(true);
              }}
              onDelete={(id) => deleteResource.mutate(id)}
              onCreate={() => setIsCreatingResource(true)}
            />
          )}
        </div>
      ) : activeTab === 'bookings' ? (
        // Bookings Tab
        <div>
           <div className="flex flex-col md:flex-row gap-6 mb-6 justify-between items-start md:items-center">
             <div className="w-64">
               <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Select Resource</label>
               <Select 
                 value={selectedResourceId}
                 onChange={(e) => setSelectedResourceId(e.target.value)}
               >
                 <option value="">-- Choose Resource --</option>
                 {resources?.map(r => (
                   <option key={r.id} value={r.id}>{r.name}</option>
                 ))}
               </Select>
             </div>
             
             {!isCreatingGroupBooking && (
               <Button 
                 onClick={() => setIsCreatingGroupBooking(true)}
                 variant="primary"
                 className="bg-indigo-600 hover:bg-indigo-500 text-white"
               >
                 <Plus size={16} className="mr-2" />
                 New Group Booking
               </Button>
             )}
           </div>

           <AnimatePresence>
             {isCreatingGroupBooking && (
               <div className="mb-8">
                 <GroupBookingCreationPanel 
                   resources={resources as Resource[] || []}
                   onSubmit={(data) => createGroupBooking.mutate(data)}
                   onCancel={() => {
                     setIsCreatingGroupBooking(false);
                     setCreateBookingError("");
                   }}
                   isSubmitting={createGroupBooking.isPending}
                   error={createBookingError}
                 />
               </div>
             )}
           </AnimatePresence>

           {!selectedResourceId ? (
             <div className="text-center py-12 text-zinc-500">
               Select a resource to view and manage bookings
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-medium text-white">Bookings</h3>
                   <Button 
                     onClick={() => setIsCreatingBooking(true)}
                     variant="secondary"
                     className="text-sm"
                   >
                     <Plus size={14} className="mr-1" /> Add Booking
                   </Button>
                 </div>

                 {isLoadingBookings ? (
                   <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>
                 ) : (
                   <BookingList 
                     bookings={bookings as Booking[]}
                     onCancel={(id) => cancelBooking.mutate(id)}
                   />
                 )}
               </div>

               {isCreatingBooking && selectedResource && (
                 <BookingCreationPanel
                   resource={selectedResource as Resource}
                   bookings={bookings || []}
                   viewDate={viewDate}
                   onViewChange={setViewDate}
                   onSubmit={(data) => createBooking.mutate(data)}
                   onCancel={() => {
                     setIsCreatingBooking(false);
                     setCreateBookingError("");
                   }}
                   isSubmitting={createBooking.isPending}
                   error={createBookingError}
                 />
                )}
              </div>
            )}
        </div>
      ) : (
        // Availability Tab
        <div>
          <div className="flex flex-col md:flex-row gap-6 mb-6 justify-between items-start md:items-center">
             <div className="w-64">
               <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Select Resource</label>
               <Select 
                 value={selectedResourceId}
                 onChange={(e) => setSelectedResourceId(e.target.value)}
               >
                 <option value="">-- Choose Resource --</option>
                 {resources?.map(r => (
                   <option key={r.id} value={r.id}>{r.name}</option>
                 ))}
               </Select>
             </div>
          </div>

          {!selectedResourceId ? (
             <div className="text-center py-12 text-zinc-500">
               Select a resource to view availability
             </div>
           ) : (
             <AvailabilityViewer
               slots={availabilitySlots || []}
               isLoading={isLoadingAvailability}
               date={availabilityDate}
               onDateChange={setAvailabilityDate}
               resourceName={selectedResource?.name}
             />
           )}
        </div>
      )}
    </ProjectDetailTemplate>
  );
}
