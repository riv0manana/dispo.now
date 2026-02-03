import { motion } from "framer-motion";
import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { Select } from "../atoms/Select";
import { FormField } from "../molecules/FormField";
import { type Resource } from "./ResourceList";

interface GroupBookingCreationPanelProps {
  resources: Resource[];
  onSubmit: (bookings: Array<{ resourceId: string; start: string; end: string; quantity: number }>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

interface BookingItem {
  id: string;
  resourceId: string;
  start: string;
  end: string;
  quantity: number;
}

export function GroupBookingCreationPanel({ 
  resources, 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  error 
}: GroupBookingCreationPanelProps) {
  const [bookings, setBookings] = useState<BookingItem[]>([
    { id: crypto.randomUUID(), resourceId: "", start: "", end: "", quantity: 1 }
  ]);

  const addBookingRow = () => {
    setBookings([
      ...bookings,
      { id: crypto.randomUUID(), resourceId: "", start: "", end: "", quantity: 1 }
    ]);
  };

  const removeBookingRow = (id: string) => {
    if (bookings.length === 1) return;
    setBookings(bookings.filter(b => b.id !== id));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBooking = (id: string, field: keyof BookingItem, value: any) => {
    setBookings(bookings.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validBookings = bookings.map(b => {
      if (!b.resourceId || !b.start || !b.end) return null;
      return {
        resourceId: b.resourceId,
        start: new Date(b.start).toISOString(),
        end: new Date(b.end).toISOString(),
        quantity: b.quantity
      };
    }).filter(Boolean);

    if (validBookings.length === 0) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit(validBookings as any);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#161616] border border-zinc-800 rounded-xl p-6 h-fit w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-medium text-white">Create Group Booking</h3>
          <p className="text-sm text-zinc-400">Book multiple resources in a single atomic transaction.</p>
        </div>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white"><X size={20}/></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div key={booking.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg relative group">
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  type="button" 
                  onClick={() => removeBookingRow(booking.id)}
                  className="text-zinc-500 hover:text-red-400 p-1"
                  disabled={bookings.length === 1}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <FormField label={index === 0 ? "Resource" : ""}>
                    <Select
                      value={booking.resourceId}
                      onChange={(e) => updateBooking(booking.id, "resourceId", e.target.value)}
                    >
                      <option value="">Select Resource</option>
                      {resources.map(r => (
                        <option key={r.id} value={r.id}>{r.name} (Cap: {r.defaultCapacity})</option>
                      ))}
                    </Select>
                  </FormField>
                </div>
                
                <div className="md:col-span-3">
                  <FormField label={index === 0 ? "Start" : ""}>
                    <Input 
                      type="datetime-local"
                      value={booking.start}
                      onChange={(e) => updateBooking(booking.id, "start", e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-3">
                  <FormField label={index === 0 ? "End" : ""}>
                    <Input 
                      type="datetime-local"
                      value={booking.end}
                      onChange={(e) => updateBooking(booking.id, "end", e.target.value)}
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label={index === 0 ? "Qty" : ""}>
                    <Input 
                      type="number"
                      min="1"
                      value={booking.quantity}
                      onChange={(e) => updateBooking(booking.id, "quantity", parseInt(e.target.value))}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button type="button" variant="secondary" onClick={addBookingRow} className="text-sm">
            <Plus size={16} className="mr-2" /> Add Another Booking
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>Create Group Booking</Button>
        </div>
      </form>
    </motion.div>
  );
}
