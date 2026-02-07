import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "../atoms/Button";
import { Select } from "../atoms/Select";
import { BookingList, type Booking } from "./BookingList";
import { BookingCreationPanel } from "./BookingCreationPanel";
import { GroupBookingCreationPanel } from "./GroupBookingCreationPanel";
import { type Resource } from "./ResourceList";

interface ProjectBookingViewProps {
  resources: Resource[];
  bookings: Booking[];
  isLoadingBookings: boolean;
  
  // Selection
  selectedResourceId: string;
  onSelectResource: (id: string) => void;
  
  // Creation
  onCreateBooking: (data: { start: string; end: string; quantity: number }) => void;
  onCreateGroupBooking: (data: any) => void;
  isCreatingBooking: boolean;
  isCreatingGroupBooking: boolean;
  createError?: string;
  onClearError: () => void;
  
  // Booking Panel State
  viewDate: Date;
  onViewDateChange: (date: Date) => void;
  
  // Booking Availability State
  bookingAvailabilitySlots: any[];
  bookingAvailabilityDate: Date | null;
  onBookingAvailabilityDateChange: (date: Date | null) => void;
  bookingSlotDuration: number;
  onBookingSlotDurationChange: (minutes: number) => void;
  isBookingAvailabilityLoading: boolean;

  // Actions
  onCancelBooking: (id: string) => void;
  onToggleCreateBooking: (isOpen: boolean) => void;
  onToggleCreateGroupBooking: (isOpen: boolean) => void;
}

export function ProjectBookingView({
  resources,
  bookings,
  isLoadingBookings,
  selectedResourceId,
  onSelectResource,
  onCreateBooking,
  onCreateGroupBooking,
  isCreatingBooking,
  isCreatingGroupBooking,
  createError,
  onClearError,
  viewDate,
  onViewDateChange,
  bookingAvailabilitySlots,
  bookingAvailabilityDate,
  onBookingAvailabilityDateChange,
  slotDuration,
  onSlotDurationChange,
  isBookingAvailabilityLoading,
  onCancelBooking,
  onToggleCreateBooking,
  onToggleCreateGroupBooking,
  initialSlot
}: ProjectBookingViewProps) {
  
  const selectedResource = resources.find(r => r.id === selectedResourceId);

  return (
    <div>
       <div className="flex flex-col md:flex-row gap-6 mb-6 justify-between items-start md:items-center">
         <div className="w-64">
           <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">Select Resource</label>
           <Select 
             value={selectedResourceId}
             onChange={(e) => onSelectResource(e.target.value)}
           >
             <option value="">-- Choose Resource --</option>
             {resources.map((r) => (
               <option key={r.id} value={r.id}>{r.name}</option>
             ))}
           </Select>
         </div>
         
         {!isCreatingGroupBooking && (
           <Button 
             onClick={() => onToggleCreateGroupBooking(true)}
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
               resources={resources}
               onSubmit={onCreateGroupBooking}
               onCancel={() => {
                 onToggleCreateGroupBooking(false);
                 onClearError();
               }}
               isSubmitting={false} // TODO: Pass loading state
               error={createError}
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
                 onClick={() => onToggleCreateBooking(true)}
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
                 bookings={bookings}
                 onCancel={onCancelBooking}
               />
             )}
           </div>

           {isCreatingBooking && selectedResource && (
             <BookingCreationPanel
               resource={selectedResource}
               bookings={bookings}
               viewDate={viewDate}
               onViewChange={onViewDateChange}
               onSubmit={onCreateBooking}
               onCancel={() => {
                 onToggleCreateBooking(false);
                 onClearError();
               }}
               isSubmitting={false} // TODO: Pass loading state
               error={createError}
               slotDurationMinutes={slotDuration}
               onSlotDurationChange={onSlotDurationChange}
               availabilitySlots={bookingAvailabilitySlots}
               selectedDate={bookingAvailabilityDate}
               onSelectedDateChange={onBookingAvailabilityDateChange}
               isAvailabilityLoading={isBookingAvailabilityLoading}
               initialSlot={initialSlot}
              />
             )}
          </div>
        )}
    </div>
  );
}
