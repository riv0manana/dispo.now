import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { FormField } from "../molecules/FormField";
import { utcToLocalTime, localToUtcTime } from "../../../lib/time";

interface ResourceConfig {
  dailyStart: string;
  dailyEnd: string;
  weeklyDays: number[];
}

interface ResourceFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    name: string;
    defaultCapacity: number;
    bookingConfig?: {
      daily?: { start?: string; end?: string };
      weekly?: { availableDays?: number[] };
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ResourceForm({ mode, initialData, onSubmit, onCancel, isSubmitting, error }: ResourceFormProps) {
  // Initialize state directly from props
  const [name, setName] = useState(initialData?.name || "");
  const [capacity, setCapacity] = useState(initialData?.defaultCapacity || 1);
  const [config, setConfig] = useState<ResourceConfig>({
    dailyStart: utcToLocalTime(initialData?.bookingConfig?.daily?.start || ""),
    dailyEnd: utcToLocalTime(initialData?.bookingConfig?.daily?.end || ""),
    weeklyDays: initialData?.bookingConfig?.weekly?.availableDays || []
  });

  // Sync state with props when initialData changes (e.g. on mount or refetch)
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCapacity(initialData.defaultCapacity);
      setConfig({
        // Convert stored UTC time to Local time for display
        dailyStart: utcToLocalTime(initialData.bookingConfig?.daily?.start || ""),
        dailyEnd: utcToLocalTime(initialData.bookingConfig?.daily?.end || ""),
        weeklyDays: initialData.bookingConfig?.weekly?.availableDays || []
      });
    } else if (mode === 'create') {
      setName("");
      setCapacity(1);
      setConfig({ dailyStart: "", dailyEnd: "", weeklyDays: [] });
    }
  }, [initialData, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { 
      name, 
      defaultCapacity: Number(capacity) 
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookingConfig: any = {};
    if (config.dailyStart || config.dailyEnd) {
      bookingConfig.daily = {};
      // Convert Local time input to UTC for storage
      if (config.dailyStart) bookingConfig.daily.start = localToUtcTime(config.dailyStart);
      if (config.dailyEnd) bookingConfig.daily.end = localToUtcTime(config.dailyEnd);
    }
    if (config.weeklyDays.length > 0) {
      bookingConfig.weekly = { availableDays: config.weeklyDays };
    }

    if (Object.keys(bookingConfig).length > 0) {
      payload.bookingConfig = bookingConfig;
    }

    onSubmit(payload);
  };

  const toggleDay = (day: number) => {
    setConfig(prev => {
      const exists = prev.weeklyDays.includes(day);
      if (exists) {
        return { ...prev, weeklyDays: prev.weeklyDays.filter(d => d !== day) };
      } else {
        return { ...prev, weeklyDays: [...prev.weeklyDays, day].sort() };
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-8 overflow-hidden"
    >
      <div className="p-6 bg-[#161616] border border-zinc-800 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-4">
          {mode === 'edit' ? 'Edit Resource' : 'Add New Resource'}
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-6 max-w-xl">
          <div className="grid gap-4">
            <FormField label="Resource Name">
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Conference Room A"
                autoFocus={mode === 'create'}
              />
            </FormField>
            <FormField label="Default Capacity">
              <Input 
                type="number" 
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
              />
            </FormField>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h4 className="text-sm font-medium text-white mb-3">Availability Configuration</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField label="Daily Start (HH:MM)">
                <Input 
                  type="time" 
                  value={config.dailyStart}
                  onChange={(e) => setConfig({...config, dailyStart: e.target.value})}
                />
              </FormField>
              <FormField label="Daily End (HH:MM)">
                <Input 
                  type="time" 
                  value={config.dailyEnd}
                  onChange={(e) => setConfig({...config, dailyEnd: e.target.value})}
                />
              </FormField>
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-2">Available Days (Select active days)</label>
              <div className="flex gap-2 flex-wrap">
                {days.map((day, idx) => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(idx)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                      config.weeklyDays.includes(idx)
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                {config.weeklyDays.length === 0 
                  ? "No days selected (Defaults to ALL days)" 
                  : `Active on: ${config.weeklyDays.sort().map(d => days[d]).join(', ')}`}
              </p>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              variant="primary"
            >
              {isSubmitting ? 'Saving...' : 'Save Resource'}
            </Button>
            <Button 
              type="button" 
              onClick={onCancel}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
