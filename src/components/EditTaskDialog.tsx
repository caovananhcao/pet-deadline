import { useState, useEffect } from "react";
import { Task, AnimalType } from "@/types/task";
import { ANIMALS } from "@/data/animals";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
}

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const [animal, setAnimal] = useState<AnimalType>("dog");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDate(new Date(task.deadline));
      setAnimal(task.animal);
    }
  }, [task]);

  const handleSubmit = () => {
    if (!task || !title.trim() || !date) return;
    onSave({
      ...task,
      title: title.trim(),
      deadline: date.toISOString(),
      animal,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-lg max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deadline Pet</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Task title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-lg",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Change your pet</Label>
            <div className="grid grid-cols-7 gap-2">
              {ANIMALS.map((a) => (
                <button
                  key={a.type}
                  type="button"
                  onClick={() => setAnimal(a.type)}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-lg transition-all text-2xl hover:bg-muted",
                    animal === a.type && "bg-primary/15 ring-2 ring-primary"
                  )}
                  title={a.label}
                >
                  <span>{a.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !date}
            className="w-full rounded-lg py-5 text-base"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
