import { Task } from "@/types/task";
import { PetAvatar } from "./PetAvatar";
import { getMood, getMoodLabel, getMoodColor, getDaysText } from "@/lib/mood";
import { format } from "date-fns";
import { Pencil, Trash2, Check, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PetCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onUndo: (id: string) => void;
}

export function PetCard({ task, onEdit, onDelete, onComplete, onUndo }: PetCardProps) {
  const mood = getMood(task.deadline, task.completed);
  const moodLabel = getMoodLabel(mood);
  const daysText = task.completed ? "Completed" : getDaysText(task.deadline);

  return (
    <div className={`relative rounded-lg p-5 bg-card card-shadow transition-all duration-300 hover:shadow-soft ${task.completed ? "opacity-80" : ""}`}>
      <div className="flex items-start gap-4">
        <PetAvatar animal={task.animal} mood={mood} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold truncate leading-tight ${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(task.deadline), "MMM d, yyyy")}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-body ${getMoodColor(mood)} text-foreground`}>
              {daysText}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 italic">
            {moodLabel}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4 justify-end">
        {task.completed ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUndo(task.id)}
            className="rounded-lg gap-1"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Undo
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onComplete(task.id)}
              className="rounded-lg gap-1 text-accent-foreground hover:bg-accent"
            >
              <Check className="w-3.5 h-3.5" />
              Finished
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
              className="rounded-lg"
            >
              <Pencil className="w-3.5 h-3.5 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="rounded-lg text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
