import { useState, useMemo } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, addHours, startOfDay,
  areIntervalsOverlapping, isBefore
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { utcToLocalTime } from '../lib/time';

interface Booking {
  id: string;
  timeRange: {
    start: string;
    end: string;
  };
  quantity: number;
  status: string;
}

interface BookingCalendarProps {
  bookings: Booking[];
  resourceCapacity: number;
  bookingConfig?: {
    daily?: { start?: string; end?: string };
    weekly?: { availableDays?: number[] };
  };
  onSelectSlot: (start: Date, end: Date) => void;
  selectedSlot?: { start: Date; end: Date } | null;
  viewDate: Date;
  onViewChange: (date: Date) => void;
}

export function BookingCalendar({ bookings, resourceCapacity, bookingConfig, onSelectSlot, selectedSlot, viewDate, onViewChange }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  // Track potential range start during selection
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);

  // --- Helper: Check if day is allowed ---
  const isDayAllowed = (date: Date) => {
    if (!bookingConfig?.weekly?.availableDays || bookingConfig.weekly.availableDays.length === 0) return true;
    const dayOfWeek = date.getDay(); // 0 = Sunday
    return bookingConfig.weekly.availableDays.includes(dayOfWeek);
  };

  // --- Calendar Grid Logic ---
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [viewDate]);

  // --- Time Slot Logic ---
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];

    const slots = [];
    const dayStart = startOfDay(selectedDate);
    
    // Determine start/end hours from config or default to 0-24
    let startHour = 0;
    let endHour = 24;

    if (bookingConfig?.daily?.start) {
      // Convert stored UTC config to Local Time for display loop
      const localStart = utcToLocalTime(bookingConfig.daily.start);
      const [h] = localStart.split(':').map(Number);
      if (!isNaN(h)) startHour = h;
    }
    if (bookingConfig?.daily?.end) {
      // Convert stored UTC config to Local Time for display loop
      const localEnd = utcToLocalTime(bookingConfig.daily.end);
      const [h] = localEnd.split(':').map(Number);
      if (!isNaN(h)) endHour = h; // e.g. 17:00 -> 17
    }

    // Create slots
    for (let i = startHour; i < endHour; i++) {
      const slotStart = addHours(dayStart, i);
      const slotEnd = addHours(slotStart, 1);

      // Calculate used capacity for this slot
      // We check if any active booking overlaps with this slot
      const usedCapacity = bookings
        .filter(b => b.status === 'active')
        .reduce((total, booking) => {
          const bookingStart = new Date(booking.timeRange.start);
          const bookingEnd = new Date(booking.timeRange.end);
          
          const isOverlapping = areIntervalsOverlapping(
            { start: slotStart, end: slotEnd },
            { start: bookingStart, end: bookingEnd }
          );

          return isOverlapping ? total + booking.quantity : total;
        }, 0);

      const available = resourceCapacity - usedCapacity;
      const isPast = isBefore(slotStart, new Date());

      slots.push({
        start: slotStart,
        end: slotEnd,
        available,
        isFull: available <= 0,
        isPast
      });
    }

    return slots;
  }, [selectedDate, bookings, resourceCapacity, bookingConfig]);

  const handlePrevMonth = () => onViewChange(subMonths(viewDate, 1));
  const handleNextMonth = () => onViewChange(addMonths(viewDate, 1));

  const handleSlotClick = (slotStart: Date, slotEnd: Date) => {
    // If no start selected yet, or clicking before current start -> Start new selection
    if (!selectionStart || isBefore(slotStart, selectionStart)) {
      setSelectionStart(slotStart);
      // Also emit single slot immediately for feedback (start -> end of this slot)
      onSelectSlot(slotStart, slotEnd); 
    } else {
      onSelectSlot(selectionStart, slotEnd); 
      setSelectionStart(null); 
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[500px]">
      {/* Left: Calendar View */}
      <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">{format(viewDate, 'MMMM yyyy')}</h3>
          <div className="flex gap-1">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-zinc-500 py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 flex-1 content-start">
          {calendarDays.map((day, idx) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, viewDate);
            const isToday = isSameDay(day, new Date());
            const isAllowed = isDayAllowed(day);

            return (
              <button
                key={idx}
                type="button"
                disabled={!isAllowed}
                onClick={() => isAllowed && setSelectedDate(day)}
                className={`
                  relative aspect-square rounded-md flex items-center justify-center text-sm font-medium transition-all
                  ${!isCurrentMonth ? 'text-zinc-700' : 'text-zinc-300'}
                  ${isSelected ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : isAllowed ? 'hover:bg-zinc-800' : 'opacity-20 cursor-not-allowed'}
                  ${isToday && !isSelected ? 'border border-emerald-500/50 text-emerald-400' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Time Slots */}
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
          {!selectedDate ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
              <CalendarIcon size={32} className="opacity-50" />
              <p className="text-sm">Select a date to view availability</p>
            </div>
          ) : (
            timeSlots.map((slot, idx) => {
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
                  onClick={() => handleSlotClick(slot.start, slot.end)}
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
    </div>
  );
}
