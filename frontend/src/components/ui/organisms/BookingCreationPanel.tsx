import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { FormField } from "../molecules/FormField";
import { BookingCalendar } from "../../BookingCalendar";
import { type Resource } from "./ResourceList";

interface BookingCreationPanelProps {
  resource: Resource;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookings: any[];
  viewDate: Date;
  onViewChange: (date: Date) => void;
  onSubmit: (data: { start: string; end: string; quantity: number }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function BookingCreationPanel({ 
  resource, 
  bookings, 
  viewDate, 
  onViewChange, 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  error 
}: BookingCreationPanelProps) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) return;
    const startIso = new Date(start).toISOString();
    const endIso = new Date(end).toISOString();
    
    onSubmit({ start: startIso, end: endIso, quantity });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#161616] border border-zinc-800 rounded-xl p-6 h-fit lg:col-span-3"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">Select a Slot to Book</h3>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white"><X size={16}/></button>
      </div>
      
      <div className="mb-6">
        <BookingCalendar 
          bookings={bookings}
          resourceCapacity={resource.defaultCapacity}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          bookingConfig={resource.bookingConfig as any}
          viewDate={viewDate}
          onViewChange={onViewChange}
          onSelectSlot={(s, e) => {
            // Format to "yyyy-MM-dd'T'HH:mm" for datetime-local input (Local Time)
            setStart(format(s, "yyyy-MM-dd'T'HH:mm"));
            setEnd(format(e, "yyyy-MM-dd'T'HH:mm"));
          }}
          selectedSlot={start && end ? { start: new Date(start), end: new Date(end) } : null}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Time">
            <Input 
              type="datetime-local" 
              value={start}
              readOnly
              className="opacity-70 cursor-not-allowed"
            />
          </FormField>
          <FormField label="End Time">
            <Input 
              type="datetime-local" 
              value={end}
              readOnly
              className="opacity-70 cursor-not-allowed"
            />
          </FormField>
        </div>
        <FormField label="Quantity">
          <Input 
            type="number" 
            min="1"
            max={resource.defaultCapacity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </FormField>
        
        {error && <p className="text-red-400 text-xs">{error}</p>}
        
        <Button 
          type="submit" 
          disabled={!start || !end}
          isLoading={isSubmitting}
          className="w-full"
        >
          Confirm Booking
        </Button>
      </form>
    </motion.div>
  );
}
