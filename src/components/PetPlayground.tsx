import { Task } from "@/types/task";
import { PetAvatar } from "./PetAvatar";
import { getAnimalInfo } from "@/data/animals";
import { format } from "date-fns";
import { Undo2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PetPlaygroundProps {
  tasks: Task[];
  onUndo: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PetPlayground({ tasks, onUndo, onDelete }: PetPlaygroundProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tasks.find((t) => t.id === selectedId);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🌿</p>
        <p className="text-muted-foreground">
          No pets here yet. Finish a task to send a pet to the playground!
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Playground scene */}
      <div
        className="relative rounded-2xl overflow-hidden min-h-[280px] p-6"
        style={{
          background: "linear-gradient(180deg, hsl(205 70% 92%) 0%, hsl(155 45% 90%) 60%, hsl(120 30% 82%) 100%)",
        }}
      >
        {/* Floating decorations */}
        <div className="absolute top-4 left-6 text-lg opacity-40 animate-pulse" style={{ animationDuration: "4s" }}>☁️</div>
        <div className="absolute top-8 right-10 text-sm opacity-30 animate-pulse" style={{ animationDuration: "5s" }}>☁️</div>
        <div className="absolute top-3 left-1/2 text-xs opacity-25 animate-pulse" style={{ animationDuration: "6s" }}>☁️</div>

        {/* Occasional sparkles */}
        <div className="absolute bottom-12 left-8 text-xs animate-idle-heart" style={{ animationDelay: "1s" }}>✨</div>
        <div className="absolute bottom-16 right-12 text-xs animate-idle-heart" style={{ animationDelay: "3s" }}>💕</div>
        <div className="absolute top-16 left-1/3 text-xs animate-idle-heart" style={{ animationDelay: "5s" }}>🌟</div>

        {/* Ground decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-around px-4 opacity-50">
          <span className="text-lg">🌱</span>
          <span className="text-sm">🌸</span>
          <span className="text-lg">🌿</span>
          <span className="text-sm">🌼</span>
          <span className="text-lg">🌱</span>
          <span className="text-sm">🌸</span>
        </div>

        {/* Pets in playground */}
        <div className="flex flex-wrap items-end justify-center gap-6 pt-8 pb-12 relative z-10">
          {tasks.map((task, i) => {
            const info = getAnimalInfo(task.animal);
            return (
              <button
                key={task.id}
                onClick={() => setSelectedId(selectedId === task.id ? null : task.id)}
                className="flex flex-col items-center gap-1 transition-transform duration-200 hover:scale-110 focus:outline-none"
                style={{ animationDelay: `${i * 0.2}s` }}
                title={task.title}
              >
                <div className="text-4xl animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  <span role="img" aria-label={info.label}>{info.emoji}</span>
                </div>
                <span className="text-[10px] text-foreground/60 font-body max-w-[60px] truncate">
                  {info.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info bubble for selected pet */}
      {selected && (
        <div className="absolute top-2 right-2 z-20 bg-card rounded-xl p-4 card-shadow max-w-[220px] animate-scale-in">
          <button
            onClick={() => setSelectedId(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="font-semibold text-sm pr-4 truncate">{selected.title}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Completed {selected.completedAt ? format(new Date(selected.completedAt), "MMM d, yyyy") : ""}
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg gap-1 text-xs h-7"
              onClick={() => {
                onUndo(selected.id);
                setSelectedId(null);
              }}
            >
              <Undo2 className="w-3 h-3" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg gap-1 text-xs h-7 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => {
                onDelete(selected.id);
                setSelectedId(null);
              }}
            >
              Release
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
