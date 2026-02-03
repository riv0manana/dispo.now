import { Ban } from "lucide-react";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Badge } from "../atoms/Badge";

export interface Booking {
  id: string;
  timeRange: {
    start: string;
    end: string;
  };
  status: string;
}

interface BookingListProps {
  bookings?: Booking[];
  onCancel: (id: string) => void;
}

export function BookingList({ bookings, onCancel }: BookingListProps) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-8 border border-zinc-800 rounded-xl text-center text-zinc-500 mb-8">
        No bookings found for this period
      </div>
    );
  }

  return (
    <Card className="mb-8">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900/50 border-b border-zinc-800">
          <tr>
            <th className="px-4 py-3 font-medium text-zinc-400">Time</th>
            <th className="px-4 py-3 font-medium text-zinc-400">ID</th>
            <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
            <th className="px-4 py-3 font-medium text-zinc-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-zinc-900/30 transition-colors">
              <td className="px-4 py-3 text-white">
                {new Date(b.timeRange.start).toLocaleString()} - <br/>
                <span className="text-zinc-500">{new Date(b.timeRange.end).toLocaleTimeString()}</span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500">{b.id.substring(0, 8)}...</td>
              <td className="px-4 py-3">
                <Badge variant={b.status === 'active' ? 'success' : 'error'}>
                  {b.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                {b.status === 'active' && (
                  <Button 
                    variant="icon"
                    onClick={() => {
                      if (confirm('Cancel this booking?')) onCancel(b.id);
                    }}
                    title="Cancel"
                    className="hover:text-red-400"
                  >
                    <Ban size={16} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
