import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../lib/sdk";
import { useState } from "react";
import { parseISO } from "date-fns";

// Domain Hooks
import { useProjectResources } from "../../hooks/useProjectResources";
import { useProjectBookings } from "../../hooks/useProjectBookings";
import { useProjectAvailability } from "../../hooks/useProjectAvailability";

// Molecules
import { ProjectTabs } from "../../components/ui/molecules/ProjectTabs";

// Organisms
import { ProjectResourceView } from "../../components/ui/organisms/ProjectResourceView";
import { ProjectBookingView } from "../../components/ui/organisms/ProjectBookingView";
import { ProjectAvailabilityView } from "../../components/ui/organisms/ProjectAvailabilityView";
import { ProjectDetailTemplate } from "../../components/templates/ProjectDetailTemplate";

export function ProjectDetailRoute() {
  const { projectId } = useParams({ from: '/dashboard/$projectId' });
  
  // --- UI State (Local) ---
  const [activeTab, setActiveTab] = useState<'resources' | 'bookings' | 'availability'>('resources');
  
  // Shared Selection State
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  
  // Shared View Date State
  const [viewDate, setViewDate] = useState(new Date());
  
  // Shared Slot Duration State
  const [slotDuration, setSlotDuration] = useState(60);
  
  // Navigation State (Availability -> Booking)
  const [initialBookingSlot, setInitialBookingSlot] = useState<{ start: Date; end: Date } | undefined>(undefined);
  const [bookingAvailabilityDate, setBookingAvailabilityDate] = useState<Date | null>(new Date());


  // --- Domain Hooks (Use Cases) ---

  // 1. Project Context
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => client.getProjects()
  });
  const project = projects?.find((p: { id: string; }) => p.id === projectId);

  // 2. Resources Management
  const {
    resources,
    isLoading: isLoadingResources,
    createResource,
    updateResource,
    deleteResource,
    createError,
    setCreateError: setCreateResourceError
  } = useProjectResources(projectId);

  // 3. Bookings Management
  const {
    bookings,
    isLoading: isLoadingBookings,
    createBooking,
    createGroupBooking,
    cancelBooking,
    createError: createBookingError,
    setCreateError: setCreateBookingError,
    isCreatingBooking,
    setIsCreatingBooking,
    isCreatingGroupBooking,
    setIsCreatingGroupBooking
  } = useProjectBookings(projectId, selectedResourceId, viewDate);

  // 4. Availability Viewer
  const {
    availabilitySlots,
    isLoading: isLoadingAvailability
  } = useProjectAvailability(
    projectId, 
    selectedResourceId, 
    viewDate, // Reusing viewDate as availabilityDate for simplicity in this refactor
    slotDuration,
    activeTab === 'availability'
  );

  // 5. Booking Creation Availability (The "Check Availability" before booking)
  const {
    availabilitySlots: bookingCreationAvailabilitySlots,
    isLoading: isBookingAvailabilityLoading
  } = useProjectAvailability(
    projectId,
    selectedResourceId,
    bookingAvailabilityDate || new Date(),
    slotDuration,
    isCreatingBooking && !!bookingAvailabilityDate
  );


  // --- Render Helpers ---

  if (!project) return <div className="p-8 text-zinc-400">Project not found or loading...</div>;

  return (
    <ProjectDetailTemplate
      project={project}
      tabs={
        <ProjectTabs 
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as any)}
          tabs={[
            { id: 'resources', label: 'Resources' },
            { id: 'bookings', label: 'Bookings' },
            { id: 'availability', label: 'Availability' }
          ]}
        />
      }
    >
      {activeTab === 'resources' ? (
        <ProjectResourceView
          resources={resources}
          isLoading={isLoadingResources}
          onCreateResource={(data) => createResource.mutate(data)}
          onUpdateResource={(id, data) => updateResource.mutate({ id, data })}
          onDeleteResource={(id) => deleteResource.mutate(id)}
          isSubmitting={createResource.isPending || updateResource.isPending}
          error={createError}
          onClearError={() => setCreateResourceError("")}
          onResourceClick={(id) => {
            setSelectedResourceId(id);
            setActiveTab('bookings');
          }}
        />
      ) : activeTab === 'bookings' ? (
        <ProjectBookingView
          resources={resources}
          bookings={bookings}
          isLoadingBookings={isLoadingBookings}
          selectedResourceId={selectedResourceId}
          onSelectResource={setSelectedResourceId}
          onCreateBooking={(data) => createBooking.mutate(data)}
          onCreateGroupBooking={(data) => createGroupBooking.mutate(data)}
          isCreatingBooking={isCreatingBooking}
          isCreatingGroupBooking={isCreatingGroupBooking}
          createError={createBookingError}
          onClearError={() => setCreateBookingError("")}
          viewDate={viewDate}
          onViewDateChange={setViewDate}
          bookingAvailabilitySlots={bookingCreationAvailabilitySlots}
          bookingAvailabilityDate={bookingAvailabilityDate}
          onBookingAvailabilityDateChange={setBookingAvailabilityDate}
          slotDuration={slotDuration}
          onSlotDurationChange={setSlotDuration}
          isBookingAvailabilityLoading={isBookingAvailabilityLoading}
          onCancelBooking={(id) => cancelBooking.mutate(id)}
          onToggleCreateBooking={(isOpen) => {
            setIsCreatingBooking(isOpen);
            if (!isOpen) {
              setInitialBookingSlot(undefined);
            }
          }}
          onToggleCreateGroupBooking={setIsCreatingGroupBooking}
          initialSlot={initialBookingSlot}
        />
      ) : (
        <ProjectAvailabilityView
          resources={resources}
          selectedResourceId={selectedResourceId}
          onSelectResource={setSelectedResourceId}
          availabilitySlots={availabilitySlots}
          isLoading={isLoadingAvailability}
          availabilityDate={viewDate}
          onAvailabilityDateChange={setViewDate}
          slotDuration={slotDuration}
          onSlotDurationChange={setSlotDuration}
          onSlotClick={(date: Date, start: string, end: string) => {
            setViewDate(date);
            setBookingAvailabilityDate(date);
            setInitialBookingSlot({ start: parseISO(start), end: parseISO(end) });
            setIsCreatingBooking(true);
            setActiveTab('bookings');
          }}
        />
      )}
    </ProjectDetailTemplate>
  );
}
