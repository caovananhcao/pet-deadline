import { PawPrint } from "lucide-react";

export function Header() {
  return (
    <header className="text-center py-8">
      <div className="flex items-center justify-center gap-2 mb-2">
        <PawPrint className="w-7 h-7 text-primary" />
        <h1 className="text-2xl">Deadline Pets</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Adopt a pet for every deadline. Keep them happy by finishing on time.
      </p>
    </header>
  );
}
