import { format, isSameDay } from 'date-fns';
import { Clock, Calendar as CalendarIcon, CheckCircle2, Loader2 } from 'lucide-react';

export interface TimeSlot {
  start: Date;
  end: Date;
  available: number;
  isFull: boolean;
  isPast: boolean;
}

interface TimeSlotListProps {
  selectedDate?: Date | null;
  slots: TimeSlot[];
  isLoading?: boolean;
  onSelectSlot: (start: Date, end: Date) => void;
  selectedSlot?: { start: Date; end: Date } | null;
  selectionStart?: Date | null;
}

export function TimeSlotList({ 
  selectedDate, 
  slots, 
  isLoading, 
  onSelectSlot, 
  selectedSlot,
  selectionStart 
}: TimeSlotListProps) {

  return (
    <div className="w-full lg:w-80 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-zinc-400 border-b border-zinc-800 pb-4">
        <Clock size={16} />
        <span className="text-sm font-medium">
          {selectedDate ? format(selectedDate, 'MMM d') : 'Select a date'}
          {selectionStart && selectedDate && isSameDay(selectionStart, selectedDate) && (
            <span className="ml-2 text-emerald-400 text-xs">(Select end time)</span>
          )}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
            <Loader2 size={32} className="animate-spin opacity-50" />
            <p className="text-sm">Loading availability...</p>
          </div>
        ) : !selectedDate ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
            <CalendarIcon size={32} className="opacity-50" />
            <p className="text-sm">Select a date to view availability</p>
          </div>
        ) : (
          slots.map((slot, idx) => {
            // Check if slot is within selected range
            const isSelected = selectedSlot && 
              slot.start.getTime() >= selectedSlot.start.getTime() &&
              slot.end.getTime() <= selectedSlot.end.getTime();
            
            // Highlight partial selection (from start to hovered/current) - tough without hover state, just highlight start
            const isPendingStart = selectionStart && slot.start.getTime() === selectionStart.getTime();

            return (
              <button
                key={idx}
                type="button"
                disabled={slot.isFull || slot.isPast}
                onClick={() => onSelectSlot(slot.start, slot.end)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all
                  ${isSelected || isPendingStart
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }
                  ${(slot.isFull || slot.isPast) ? 'opacity-40 cursor-not-allowed bg-zinc-900/50' : 'hover:bg-zinc-800'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono">{format(slot.start, 'HH:mm')}</span>
                  {(isSelected || isPendingStart) && <CheckCircle2 size={14} />}
                </div>
                <div className="text-xs">
                  {slot.isFull 
                    ? <span className="text-red-400">Full</span> 
                    : slot.isPast
                      ? <span>Past</span>
                      : <span className="text-zinc-500">{slot.available} left</span>
                  }
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
