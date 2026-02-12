import { getAnimalInfo } from "@/data/animals";
import { PetMood, AnimalType } from "@/types/task";
import { useState, useEffect } from "react";

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
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (mood === "celebrating") {
      setShowCelebration(true);
      const t = setTimeout(() => setShowCelebration(false), 800);
      return () => clearTimeout(t);
    }
  }, [mood]);

  const moodStyles: Record<PetMood, string> = {
    healthy: "animate-float animate-blink",
    worried: "animate-wiggle",
    sleeping: "opacity-60 grayscale-[30%] animate-breathe",
    celebrating: showCelebration ? "animate-celebrate" : "animate-float",
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all duration-500 ${moodStyles[mood]}`}
        style={{
          filter: mood === "sleeping" ? "saturate(0.7)" : undefined,
          transform: mood === "sleeping" && !showCelebration ? "rotate(-15deg)" : undefined,
        }}
      >
        <span role="img" aria-label={info.label}>
          {info.emoji}
        </span>
      </div>

      {/* Healthy idle: sparkle + occasional heart */}
      {mood === "healthy" && (
        <>
          <span className="absolute -top-1 -right-1 text-sm animate-pulse">✨</span>
          <span className="absolute -top-3 left-0 text-xs animate-idle-heart">💕</span>
        </>
      )}

      {/* Worried: sweat drop + exclamation */}
      {mood === "worried" && (
        <>
          <span className="absolute -top-1 -right-1 text-sm">💧</span>
          <span className="absolute -top-2 left-1 text-xs animate-pulse opacity-70">❗</span>
        </>
      )}

      {/* Sleeping: slow zzz */}
      {mood === "sleeping" && (
        <div
          className="absolute -top-2 right-0 text-xs font-semibold text-muted-foreground"
          style={{ animation: "zzz-float 2s ease-in-out infinite" }}
        >
          💤
        </div>
      )}

      {/* Celebrating: floating hearts + sparkle burst */}
      {mood === "celebrating" && showCelebration && (
        <>
          <span className="absolute -top-3 left-1 text-sm animate-heart-float">💖</span>
          <span className="absolute -top-2 right-0 text-sm animate-heart-float" style={{ animationDelay: "0.15s" }}>💕</span>
          <span className="absolute -top-4 left-4 text-xs animate-heart-float" style={{ animationDelay: "0.3s" }}>💗</span>
          <span className="absolute top-0 -left-2 text-xs animate-sparkle-pop">✨</span>
          <span className="absolute -top-1 right-2 text-xs animate-sparkle-pop" style={{ animationDelay: "0.2s" }}>🌟</span>
        </>
      )}

      {/* Celebrating idle (after burst) */}
      {mood === "celebrating" && !showCelebration && (
        <span className="absolute -top-1 -right-1 text-sm animate-pulse">🎉</span>
      )}
    </div>
  );
}
