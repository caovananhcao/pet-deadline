import { getAnimalInfo } from "@/data/animals";
import { PetMood, AnimalType } from "@/types/task";

interface PetAvatarProps {
  animal: AnimalType;
  mood: PetMood;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-3xl w-12 h-12",
  md: "text-5xl w-20 h-20",
  lg: "text-6xl w-24 h-24",
};

export function PetAvatar({ animal, mood, size = "md" }: PetAvatarProps) {
  const info = getAnimalInfo(animal);

  const moodStyles: Record<PetMood, string> = {
    healthy: "animate-float",
    worried: "animate-wiggle",
    sleeping: "opacity-60 grayscale-[30%]",
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all duration-500 ${moodStyles[mood]}`}
        style={{
          filter: mood === "sleeping" ? "saturate(0.7)" : undefined,
          transform: mood === "sleeping" ? "rotate(-15deg)" : undefined,
        }}
      >
        <span role="img" aria-label={info.label}>
          {info.emoji}
        </span>
      </div>

      {/* Mood indicators */}
      {mood === "healthy" && (
        <span className="absolute -top-1 -right-1 text-sm animate-pulse">
          ✨
        </span>
      )}
      {mood === "worried" && (
        <span className="absolute -top-1 -right-1 text-sm">💧</span>
      )}
      {mood === "sleeping" && (
        <div className="absolute -top-2 right-0 text-xs font-semibold text-muted-foreground"
          style={{ animation: "zzz-float 2s ease-in-out infinite" }}>
          💤
        </div>
      )}
    </div>
  );
}
