import { Link } from "@tanstack/react-router";
import { ArrowRight, Edit2, Trash2 } from "lucide-react";
import { ProjectInfo } from "../molecules/ProjectInfo";
import { Button } from "../atoms/Button";

export interface Project {
  id: string;
  name: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  isLast?: boolean;
}

export function ProjectCard({ project, onEdit, onDelete, isLast }: ProjectCardProps) {
  return (
    <div 
      className={`group flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors ${!isLast ? 'border-b border-zinc-800' : ''}`}
    >
      <ProjectInfo name={project.name} id={project.id} />
      
      <Link 
        to="/dashboard/$projectId"
        params={{ projectId: project.id }}
        className="flex items-center gap-2 text-sm font-medium text-zinc-500 group-hover:text-emerald-400 transition-colors pr-2"
      >
        Open <ArrowRight size={16} />
      </Link>
      
      <div className="flex items-center gap-2 ml-4 border-l border-zinc-800 pl-4">
         <Button 
           variant="icon"
           onClick={() => onEdit(project)}
           title="Edit Project"
         >
           <Edit2 size={16} />
         </Button>
         <Button 
           variant="icon"
           onClick={() => onDelete(project.id)}
           title="Delete Project"
           className="hover:text-red-400"
         >
           <Trash2 size={16} />
         </Button>
      </div>
    </div>
  );
}
