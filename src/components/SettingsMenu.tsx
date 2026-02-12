import { useState } from "react";
import { Settings, Volume2, VolumeX, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/types/task";
import { isSoundEnabled, setSoundEnabled, playToggleSound, playExportSound, playImportSound } from "@/lib/sounds";
import { toast } from "sonner";
import { useRef } from "react";

interface SettingsMenuProps {
  tasks: Task[];
  onImport: (tasks: Task[]) => void;
}

export function SettingsMenu({ tasks, onImport }: SettingsMenuProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    setSoundOn(checked);
    if (checked) playToggleSound();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    downloadBlob(blob, "deadline-pets.json");
    playExportSound();
    toast.success("Tasks exported as JSON");
  };

  const exportCSV = () => {
    const header = "id,title,deadline,animal,createdAt\n";
    const rows = tasks
      .map(
        (t) =>
          `"${t.id}","${t.title.replace(/"/g, '""')}","${t.deadline}","${t.animal}","${t.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    downloadBlob(blob, "deadline-pets.csv");
    playExportSound();
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
        const valid = imported
          .filter((t) => t.title && t.deadline && t.animal)
          .map((t) => ({
            id: t.id || crypto.randomUUID(),
            title: t.title,
            deadline: t.deadline,
            animal: t.animal,
            createdAt: t.createdAt || new Date().toISOString(),
          }));

        onImport(valid);
        playImportSound();
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
        animal: (clean[3] as Task["animal"]) || "dog",
        createdAt: clean[4] || new Date().toISOString(),
      };
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-lg">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-toggle" className="flex items-center gap-2 text-sm cursor-pointer">
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Sound effects
            </Label>
            <Switch
              id="sound-toggle"
              checked={soundOn}
              onCheckedChange={handleSoundToggle}
            />
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold mb-2">Data</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 rounded-lg"
              onClick={exportJSON}
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 rounded-lg"
              onClick={exportCSV}
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 rounded-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" /> Import file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              className="hidden"
              onChange={handleFileImport}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
