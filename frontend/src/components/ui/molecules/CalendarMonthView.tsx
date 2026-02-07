import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

interface CalendarMonthViewProps {
  viewDate: Date;
  onViewChange: (date: Date) => void;
  selectedDate?: Date | null;
  onSelectDate: (date: Date) => void;
  allowedDays?: number[]; // Day of week indices (0=Sun)
}

export function CalendarMonthView({ 
  viewDate, 
  onViewChange, 
  selectedDate, 
  onSelectDate,
  allowedDays
}: CalendarMonthViewProps) {
  
  const handlePrevMonth = () => {
    const prev = new Date(viewDate);
    prev.setMonth(prev.getMonth() - 1);
    onViewChange(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + 1);
    onViewChange(next);
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [viewDate]);

  const isDayAllowed = (date: Date) => {
    if (!allowedDays || allowedDays.length === 0) return true;
    return allowedDays.includes(date.getDay());
  };

  return (
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
              onClick={() => isAllowed && onSelectDate(day)}
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
  );
}
