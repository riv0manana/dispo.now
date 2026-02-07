import { Select } from "../atoms/Select";
import { AvailabilityViewer, type AvailabilitySlot } from "./AvailabilityViewer";
import { type Resource } from "./ResourceList";

interface ProjectAvailabilityViewProps {
  resources: Resource[];
  selectedResourceId: string;
  onSelectResource: (id: string) => void;
  
  availabilitySlots: AvailabilitySlot[];
  isLoading: boolean;
  
  availabilityDate: Date;
  onAvailabilityDateChange: (date: Date) => void;
  
  slotDuration: number;
  onSlotDurationChange: (minutes: number) => void;
  onSlotClick: (date: Date, start: string, end: string) => void;
}

export function ProjectAvailabilityView({
  resources,
  selectedResourceId,
  onSelectResource,
  availabilitySlots,
  isLoading,
  availabilityDate,
  onAvailabilityDateChange,
  slotDuration,
  onSlotDurationChange,
  onSlotClick
}: ProjectAvailabilityViewProps) {
  
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
      </div>

      {!selectedResourceId ? (
         <div className="text-center py-12 text-zinc-500">
           Select a resource to view availability
         </div>
       ) : (
         <AvailabilityViewer
           slots={availabilitySlots}
           isLoading={isLoading}
           date={availabilityDate}
           onDateChange={onAvailabilityDateChange}
           resourceName={selectedResource?.name}
           slotDurationMinutes={slotDuration}
           onSlotDurationChange={onSlotDurationChange}
           onSlotClick={onSlotClick}
         />
       )}
    </div>
  );
}
