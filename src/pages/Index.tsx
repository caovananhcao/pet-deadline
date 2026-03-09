import { useState, useCallback, useMemo } from "react";
import { Task } from "@/types/task";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Header } from "@/components/Header";
import { PetCard } from "@/components/PetCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { SettingsMenu } from "@/components/SettingsMenu";
import { TaskTabs, TabKey } from "@/components/TaskTabs";
import { PetPlayground } from "@/components/PetPlayground";
import { ConfettiRain } from "@/components/ConfettiRain";
import { isOverdue } from "@/lib/mood";
import { toast } from "sonner";
import { playAdoptSound, playDeleteSound, playSaveSound, playCelebrateSound } from "@/lib/sounds";
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
  const [tab, setTab] = useState<TabKey>("active");
  const [confettiKey, setConfettiKey] = useState(0);

  const activeTasks = useMemo(
    () => tasks.filter((t) => !t.completed && !isOverdue(t.deadline)),
    [tasks]
  );
  const overdueTasks = useMemo(
    () => tasks.filter((t) => !t.completed && isOverdue(t.deadline)),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.completed),
    [tasks]
  );

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

  const handleComplete = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const next = prev.map((t) =>
          t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
        );
        const remaining = next.filter((t) => !t.completed && !isOverdue(t.deadline));
        if (remaining.length === 0) {
          setConfettiKey((k) => k + 1);
        }
        return next;
      });
      playCelebrateSound();
      toast.success("Great job! Your pet is celebrating!");
    },
    [setTasks]
  );

  const handleUndo = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: false, completedAt: undefined } : t
        )
      );
      toast.success("Task restored");
    },
    [setTasks]
  );

  const handleImport = useCallback(
    (imported: Task[]) => {
      setTasks((prev) => [...prev, ...imported]);
    },
    [setTasks]
  );

  const renderCards = (list: Task[]) => {
    if (list.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🐾</p>
          <p className="text-muted-foreground">No pets here right now.</p>
        </div>
      );
    }
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((task) => (
          <PetCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
            onComplete={handleComplete}
            onUndo={handleUndo}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ConfettiRain trigger={confettiKey} />
      <div className="container max-w-2xl mx-auto px-4 pb-12">
        <Header />

        <div className="flex items-center justify-between gap-4 mb-6">
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
          <>
            <TaskTabs
              active={tab}
              onChange={setTab}
              counts={{
                active: activeTasks.length,
                overdue: overdueTasks.length,
                completed: completedTasks.length,
              }}
            />

            {tab === "active" && renderCards(activeTasks)}
            {tab === "overdue" && renderCards(overdueTasks)}
            {tab === "completed" && (
              <PetPlayground
                tasks={completedTasks}
                onUndo={handleUndo}
                onDelete={(id) => setDeleteId(id)}
              />
            )}
          </>
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
