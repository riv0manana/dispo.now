import { Card } from "../atoms/Card";
import { ProjectCard, type Project } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  return (
    <Card>
      {projects.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          isLast={i === projects.length - 1}
        />
      ))}
    </Card>
  );
}
