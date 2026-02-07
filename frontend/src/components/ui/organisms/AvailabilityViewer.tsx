import { format, parseISO } from 'date-fns';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { SlotDurationSelector } from '../molecules/SlotDurationSelector';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export type AvailabilitySlot = {
  start: string;
  end: string;
  available: number;
};

interface AvailabilityViewerProps {
  slots: AvailabilitySlot[];
  isLoading: boolean;
  date: Date;
  onDateChange: (date: Date) => void;
  resourceName?: string;
  slotDurationMinutes: number;
  onSlotDurationChange: (minutes: number) => void;
}

export function AvailabilityViewer({ 
  slots, 
  isLoading, 
  date, 
  onDateChange,
  resourceName,
  slotDurationMinutes,
  onSlotDurationChange,
  onSlotClick
}: AvailabilityViewerProps) {
  
  const handlePrevDay = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const handleNextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const hasSlots = slots.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <Button variant="icon" onClick={handlePrevDay}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white">
              {format(date, 'EEEE, MMMM d, yyyy')}
            </h3>
            {resourceName && (
              <p className="text-sm text-zinc-400">
                Availability for <span className="text-emerald-400">{resourceName}</span>
              </p>
            )}
          </div>
          <Button variant="icon" onClick={handleNextDay}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="mr-2">
             <SlotDurationSelector 
               value={slotDurationMinutes} 
               onChange={onSlotDurationChange} 
             />
          </div>

          <Badge variant="neutral" className="border border-zinc-800 bg-zinc-900 text-zinc-300">
            {slots.length} Slots Found
          </Badge>
          <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => onDateChange(new Date())}>
            Today
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-24 bg-zinc-900/50 rounded-xl animate-pulse border border-zinc-800/50" />
          ))}
        </div>
      ) : !hasSlots ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-zinc-800 bg-transparent">
          <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-zinc-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Availability</h3>
          <p className="text-zinc-400 max-w-sm">
            There are no available slots for this date. The resource might be fully booked, closed, or outside operating hours.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {slots.map((slot, index) => {
            const startDate = parseISO(slot.start);
            const endDate = parseISO(slot.end);
            const isFull = slot.available === 0;

            return (
              <motion.div
                key={slot.start}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !isFull && onSlotClick?.(date, slot.start, slot.end)}
                className={!isFull && onSlotClick ? 'cursor-pointer' : ''}
              >
                <Card className={`
                  relative overflow-hidden transition-all duration-200 hover:border-zinc-600
                  ${isFull ? 'opacity-50 grayscale' : 'hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10'}
                `}>
                  <div className="p-4 flex flex-col items-center justify-center text-center gap-2">
                    <div className="text-lg font-mono font-bold text-white tracking-tight">
                      {format(startDate, 'HH:mm')} 
                      <span className="text-zinc-600 mx-1">-</span>
                      {format(endDate, 'HH:mm')}
                    </div>
                    
                    <div className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${isFull 
                        ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }
                    `}>
                      {isFull ? 'Full' : `${slot.available} Available`}
                    </div>
                  </div>
                  
                  {/* Progress bar visual for capacity */}
                  {!isFull && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                      <div 
                        className="h-full bg-emerald-500/50" 
                        style={{ width: '100%' }} // Could be dynamic if we knew total capacity
                      />
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
