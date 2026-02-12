import { Task } from "@/types/task";
import { PetAvatar } from "./PetAvatar";
import { getMood, getMoodLabel, getMoodColor, getDaysText } from "@/lib/mood";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PetCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function PetCard({ task, onEdit, onDelete }: PetCardProps) {
  const mood = getMood(task.deadline);
  const moodLabel = getMoodLabel(mood);
  const daysText = getDaysText(task.deadline);

  return (
    <div className={`relative rounded-lg p-5 bg-card card-shadow transition-all duration-300 hover:shadow-soft`}>
      <div className="flex items-start gap-4">
        <PetAvatar animal={task.animal} mood={mood} />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold truncate leading-tight">
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
      </div>
    </div>
  );
}
