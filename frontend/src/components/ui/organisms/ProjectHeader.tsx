import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ApiKeyDisplay } from "../molecules/ApiKeyDisplay";

interface ProjectHeaderProps {
  project?: {
    id: string;
    name: string;
    apiKey: string;
  };
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  if (!project) return null;

  return (
    <div className="mb-8">
      <Link to="/dashboard" className="text-sm text-zinc-500 hover:text-white flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back to Projects
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{project.name}</h1>
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-sm">
            <span>{project.id}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
            <span className="text-emerald-500">Active</span>
          </div>
        </div>
        <ApiKeyDisplay apiKey={project.apiKey} />
      </div>
    </div>
  );
}
