import { Plus } from "lucide-react";
import { Button } from "../atoms/Button";

interface ProjectEmptyStateProps {
  onCreate: () => void;
}

export function ProjectEmptyState({ onCreate }: ProjectEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 border border-zinc-700">
        <span className="text-3xl">👋</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to dispo.now</h2>
      <p className="text-zinc-400 mb-8 max-w-md">
        <strong className="text-white block mb-1">Step 1 — Create your first Project</strong>
        A Project represents your app / tenant / SaaS customer.
      </p>
      <Button onClick={onCreate} variant="primary">
        <Plus size={18} className="mr-2" />
        Create Project
      </Button>
    </div>
  );
}
