import { type ReactNode } from "react";
import { PageHeader } from "../ui/molecules/PageHeader";

interface DashboardTemplateProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  modal?: ReactNode;
}

export function DashboardTemplate({ title, action, children, modal }: DashboardTemplateProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader title={title} action={action} />
      {modal}
      {children}
    </div>
  );
}
