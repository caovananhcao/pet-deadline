import { AnimalInfo, AnimalType } from "@/types/task";

export const ANIMALS: AnimalInfo[] = [
  { type: "dog", emoji: "🐶", label: "Dog" },
  { type: "cat", emoji: "🐱", label: "Cat" },
  { type: "rabbit", emoji: "🐰", label: "Rabbit" },
  { type: "chicken", emoji: "🐔", label: "Chicken" },
  { type: "pig", emoji: "🐷", label: "Pig" },
  { type: "duck", emoji: "🦆", label: "Duck" },
  { type: "parrot", emoji: "🦜", label: "Parrot" },
  { type: "tiger", emoji: "🐯", label: "Tiger" },
  { type: "pigeon", emoji: "🕊️", label: "Pigeon" },
  { type: "turtle", emoji: "🐢", label: "Turtle" },
  { type: "hamster", emoji: "🐹", label: "Hamster" },
  { type: "otter", emoji: "🦦", label: "Otter" },
  { type: "cow", emoji: "🐮", label: "Cow" },
  { type: "buffalo", emoji: "🦬", label: "Buffalo" },
  { type: "horse", emoji: "🐴", label: "Horse" },
  { type: "dragon", emoji: "🐲", label: "Dragon" },
  { type: "goat", emoji: "🐐", label: "Goat" },
  { type: "sheep", emoji: "🐑", label: "Sheep" },
  { type: "monkey", emoji: "🐵", label: "Monkey" },
  { type: "beaver", emoji: "🦫", label: "Beaver" },
  { type: "bear", emoji: "🐻", label: "Bear" },
];

export function getAnimalInfo(type: AnimalType): AnimalInfo {
  return ANIMALS.find((a) => a.type === type) || ANIMALS[0];
}
