import { Edit2, Trash2, Box } from "lucide-react";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { utcToLocalTime } from "../../../lib/time";

export interface Resource {
  id: string;
  name: string;
  defaultCapacity: number;
  bookingConfig?: {
    daily?: { start?: string; end?: string };
    weekly?: { availableDays?: number[] };
  };
}

interface ResourceListProps {
  resources?: Resource[];
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onResourceClick?: (resource: Resource) => void;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ResourceList({ resources, onEdit, onDelete, onCreate, onResourceClick }: ResourceListProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-12 border border-zinc-800 border-dashed rounded-xl bg-zinc-900/30">
        <Box className="mx-auto text-zinc-600 mb-3" size={48} />
        <h3 className="text-zinc-300 font-medium mb-1">No resources yet</h3>
        <p className="text-zinc-500 text-sm mb-4">Create a resource to start accepting bookings.</p>
        <button 
          type="button"
          onClick={onCreate}
          className="text-emerald-400 text-sm font-medium hover:underline"
        >
          Create your first resource
        </button>
      </div>
    );
  }

  return (
    <Card>
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900/50 border-b border-zinc-800">
          <tr>
            <th className="px-6 py-3 font-medium text-zinc-400">Name</th>
            <th className="px-6 py-3 font-medium text-zinc-400">ID</th>
            <th className="px-6 py-3 font-medium text-zinc-400">Capacity</th>
            <th className="px-6 py-3 font-medium text-zinc-400">Availability</th>
            <th className="px-6 py-3 font-medium text-zinc-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {resources.map((res) => (
            <tr 
              key={res.id} 
              className={`group hover:bg-zinc-900/30 transition-colors ${onResourceClick ? 'cursor-pointer' : ''}`}
              onClick={() => onResourceClick?.(res)}
            >
              <td className="px-6 py-4 font-medium text-white">{res.name}</td>
              <td className="px-6 py-4 font-mono text-zinc-500">{res.id}</td>
              <td className="px-6 py-4 text-zinc-300">{res.defaultCapacity}</td>
              <td className="px-6 py-4 text-zinc-400 text-xs">
                {res.bookingConfig?.daily?.start
                  ? `${utcToLocalTime(res.bookingConfig.daily.start)}-${utcToLocalTime(res.bookingConfig.daily.end || '')}`
                  : '24h'}
                <span className="mx-1">•</span>
                {res.bookingConfig?.weekly?.availableDays 
                  ? res.bookingConfig.weekly.availableDays.map((d: number) => days[d]).join(',') 
                  : 'Daily'}
              </td>
              <td className="px-6 py-4 text-right">
                 <div className="flex items-center justify-end gap-2">
                   <Button 
                     variant="icon"
                     onClick={(e) => {
                       e.stopPropagation();
                       onEdit(res);
                     }}
                     title="Edit"
                   >
                     <Edit2 size={16} />
                   </Button>
                   <Button 
                     variant="icon"
                     onClick={(e) => {
                       e.stopPropagation();
                       if (confirm('Delete this resource?')) onDelete(res.id);
                     }}
                     title="Delete"
                     className="hover:text-red-400"
                   >
                     <Trash2 size={16} />
                   </Button>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
