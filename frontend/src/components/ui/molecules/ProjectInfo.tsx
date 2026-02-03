import { Folder } from "lucide-react";

interface ProjectInfoProps {
  name: string;
  id: string;
}

export function ProjectInfo({ name, id }: ProjectInfoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
        <Folder size={20} />
      </div>
      <div>
        <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors">
          {name}
        </h3>
        <span className="text-xs text-zinc-500 font-mono">{id}</span>
      </div>
    </div>
  );
}
