import { useState, useCallback } from "react";
import { Task } from "@/types/task";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Header } from "@/components/Header";
import { PetCard } from "@/components/PetCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { SettingsMenu } from "@/components/SettingsMenu";
import { toast } from "sonner";
import { playAdoptSound, playDeleteSound, playSaveSound } from "@/lib/sounds";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("deadline-pets-tasks", []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = useCallback(
    (taskData: Omit<Task, "id" | "createdAt">) => {
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
      playAdoptSound();
      toast.success("Your new pet has arrived!");
    },
    [setTasks]
  );

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setEditOpen(true);
  }, []);

  const handleSave = useCallback(
    (updated: Task) => {
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      playSaveSound();
      toast.success("Changes saved");
    },
    [setTasks]
  );

  const confirmDelete = useCallback(() => {
    if (!deleteId) return;
    setTasks((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
    playDeleteSound();
    toast.success("Pet released. Goodbye, little friend.");
  }, [deleteId, setTasks]);

  const handleImport = useCallback(
    (imported: Task[]) => {
      setTasks((prev) => [...prev, ...imported]);
    },
    [setTasks]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 pb-12">
        <Header />

        <div className="flex items-center justify-between gap-4 mb-8">
          <AddTaskDialog onAdd={handleAdd} />
          <SettingsMenu tasks={tasks} onImport={handleImport} />
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-muted-foreground">
              No pets yet. Adopt one to get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tasks.map((task) => (
              <PetCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}

        <EditTaskDialog
          task={editingTask}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={handleSave}
        />

        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent className="rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle>Release this pet?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the task and its pet. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-lg">Keep it</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="rounded-lg">
                Release
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;
