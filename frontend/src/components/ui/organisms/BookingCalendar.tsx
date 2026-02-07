import { useState, useMemo } from 'react';
import { 
    addHours, addMinutes, startOfDay,
    areIntervalsOverlapping, isBefore
} from 'date-fns';
import { utcToLocalTime } from '../../../lib/time';
import { type AvailabilitySlot } from '../../../lib/sdk';
import { CalendarMonthView } from '../molecules/CalendarMonthView';
import { TimeSlotList, type TimeSlot } from '../molecules/TimeSlotList';

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
  slotDurationMinutes?: number;
  onSelectSlot: (start: Date, end: Date) => void;
  selectedSlot?: { start: Date; end: Date } | null;
  viewDate: Date;
  onViewChange: (date: Date) => void;
  // Controlled date selection
  selectedDate?: Date | null;
  onSelectedDateChange?: (date: Date | null) => void;
  // External availability data (source of truth)
  availabilitySlots?: AvailabilitySlot[];
  isLoading?: boolean;
}

export function BookingCalendar({ 
  bookings, 
  resourceCapacity, 
  bookingConfig, 
  slotDurationMinutes = 60,
  onSelectSlot, 
  selectedSlot, 
  viewDate, 
  onViewChange,
  selectedDate: controlledSelectedDate,
  onSelectedDateChange,
  availabilitySlots,
  isLoading
}: BookingCalendarProps) {
  // Use controlled state if provided, otherwise internal state
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(new Date());
  
  const selectedDate = controlledSelectedDate !== undefined ? controlledSelectedDate : internalSelectedDate;
  const handleDateChange = (date: Date | null) => {
    if (onSelectedDateChange) {
      onSelectedDateChange(date);
    } else {
      setInternalSelectedDate(date);
    }
  };

  // Track potential range start during selection
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);

  // --- Time Slot Logic ---
  const timeSlots: TimeSlot[] = useMemo(() => {
    // Priority 1: Use provided availability slots directly
    if (availabilitySlots) {
      return availabilitySlots.map(slot => ({
        start: new Date(slot.start),
        end: new Date(slot.end),
        available: slot.available,
        isFull: slot.available <= 0,
        isPast: isBefore(new Date(slot.start), new Date())
      }));
    }

    // Priority 2: Fallback to local generation (existing logic)
    if (!selectedDate) return [];

    const slots: TimeSlot[] = [];
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
    let current = addHours(dayStart, startHour);
    const end = addHours(dayStart, endHour);

    while (isBefore(current, end)) {
      const slotStart = current;
      const slotEnd = addMinutes(slotStart, slotDurationMinutes);
      
      // Stop if slot exceeds end time
      if (isBefore(end, slotEnd)) break;

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

      current = slotEnd;
    }

    return slots;
  }, [selectedDate, bookings, resourceCapacity, bookingConfig, slotDurationMinutes, availabilitySlots]);


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
    <div className="flex flex-col lg:flex-row gap-6 h-125">
      <CalendarMonthView 
        viewDate={viewDate}
        onViewChange={onViewChange}
        selectedDate={selectedDate}
        onSelectDate={handleDateChange}
        allowedDays={bookingConfig?.weekly?.availableDays}
      />

      <TimeSlotList 
        selectedDate={selectedDate}
        slots={timeSlots}
        isLoading={isLoading}
        onSelectSlot={handleSlotClick}
        selectedSlot={selectedSlot}
        selectionStart={selectionStart}
      />
    </div>
  );
}
