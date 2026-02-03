import { type ReactNode } from "react";
import { ProjectHeader } from "../ui/organisms/ProjectHeader";

interface ProjectDetailTemplateProps {
  project?: {
    id: string;
    name: string;
    apiKey: string;
  };
  tabs: ReactNode;
  children: ReactNode;
}

export function ProjectDetailTemplate({ project, tabs, children }: ProjectDetailTemplateProps) {
  if (!project) return <div className="p-8 text-zinc-400">Project not found or loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <ProjectHeader project={project} />
      {tabs}
      {children}
    </div>
  );
}
