interface TabItem {
  id: string;
  label: string;
}

interface ProjectTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function ProjectTabs({ tabs, activeTab, onTabChange }: ProjectTabsProps) {
  return (
    <div className="flex gap-6 border-b border-zinc-800 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 border-b-2 font-medium text-sm transition-colors ${
            activeTab === tab.id
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
