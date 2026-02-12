import { Task } from "@/types/task";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { toast } from "sonner";

interface ImportExportProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export function ImportExport({ tasks, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    downloadBlob(blob, "deadline-pets.json");
    toast.success("Tasks exported as JSON");
  };

  const exportCSV = () => {
    const header = "id,title,deadline,animal,createdAt\n";
    const rows = tasks.map(
      (t) => `"${t.id}","${t.title.replace(/"/g, '""')}","${t.deadline}","${t.animal}","${t.createdAt}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    downloadBlob(blob, "deadline-pets.csv");
    toast.success("Tasks exported as CSV");
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let imported: Task[];

        if (file.name.endsWith(".csv")) {
          imported = parseCSV(text);
        } else {
          imported = JSON.parse(text);
        }

        if (!Array.isArray(imported)) throw new Error("Invalid format");
        const valid = imported.filter(
          (t) => t.title && t.deadline && t.animal
        ).map((t) => ({
          id: t.id || crypto.randomUUID(),
          title: t.title,
          deadline: t.deadline,
          animal: t.animal,
          createdAt: t.createdAt || new Date().toISOString(),
        }));

        onImport(valid);
        toast.success(`Imported ${valid.length} task${valid.length !== 1 ? "s" : ""}`);
      } catch {
        toast.error("Could not import file. Please check the format.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const parseCSV = (text: string): Task[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    return lines.slice(1).map((line) => {
      const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const clean = cols.map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"'));
      return {
        id: clean[0] || crypto.randomUUID(),
        title: clean[1] || "",
        deadline: clean[2] || "",
        animal: clean[3] as Task["animal"] || "dog",
        createdAt: clean[4] || new Date().toISOString(),
      };
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={exportJSON}>
        <Download className="w-3.5 h-3.5" /> JSON
      </Button>
      <Button variant="outline" size="sm" className="rounded-lg gap-1.5" onClick={exportCSV}>
        <Download className="w-3.5 h-3.5" /> CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg gap-1.5"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-3.5 h-3.5" /> Import
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        className="hidden"
        onChange={handleFileImport}
      />
    </div>
  );
}
