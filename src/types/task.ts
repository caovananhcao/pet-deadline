export type AnimalType =
  | "dog" | "cat" | "rabbit" | "chicken" | "pig" | "duck"
  | "parrot" | "tiger" | "pigeon" | "turtle" | "hamster" | "otter"
  | "cow" | "buffalo" | "horse" | "dragon" | "goat" | "sheep"
  | "monkey" | "beaver" | "bear";

export type PetMood = "healthy" | "worried" | "sleeping";

export interface Task {
  id: string;
  title: string;
  deadline: string; // ISO date string
  animal: AnimalType;
  createdAt: string;
}

export interface AnimalInfo {
  type: AnimalType;
  emoji: string;
  label: string;
}
