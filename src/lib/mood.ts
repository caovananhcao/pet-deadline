import { PetMood } from "@/types/task";

export function getMood(deadline: string, completed?: boolean): PetMood {
  if (completed) return "celebrating";
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const diffMs = dl.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "sleeping";
  if (diffDays <= 3) return "worried";
  return "healthy";
}

export function getMoodLabel(mood: PetMood): string {
  switch (mood) {
    case "healthy": return "It's healthy and safe";
    case "worried": return "It needs help, more attention please";
    case "sleeping": return "Zzz";
    case "celebrating": return "Mission complete! So happy!";
  }
}

export function getMoodColor(mood: PetMood): string {
  switch (mood) {
    case "healthy": return "bg-mint";
    case "worried": return "bg-pale-yellow";
    case "sleeping": return "bg-lavender";
    case "celebrating": return "bg-peach";
  }
}

export function getDaysText(deadline: string): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dl = new Date(deadline);
  dl.setHours(0, 0, 0, 0);
  const diffMs = dl.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} overdue`;
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `${diffDays} days left`;
}
