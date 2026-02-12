import { cn } from "@/lib/utils";

export type TabKey = "active" | "overdue" | "completed";

interface TabItem {
  key: TabKey;
  label: string;
  count: number;
  emoji: string;
}

interface TaskTabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  counts: { active: number; overdue: number; completed: number };
}

export function TaskTabs({ active, onChange, counts }: TaskTabsProps) {
  const tabs: TabItem[] = [
    { key: "active", label: "Active", count: counts.active, emoji: "🐾" },
    { key: "overdue", label: "Overdue", count: counts.overdue, emoji: "😴" },
    { key: "completed", label: "Completed", count: counts.completed, emoji: "🎉" },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold font-body transition-all duration-200",
            active === tab.key
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <span className="text-base">{tab.emoji}</span>
          <span>{tab.label}</span>
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
              active === tab.key
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background text-muted-foreground"
            )}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
