
"use client";

import Image from "next/image";
import type { Team } from "@/lib/teams";
import { cn } from "@/lib/utils";

export function GridCell({
  player,
  isSelected,
}: {
  rowTeam: Team;
  colTeam: Team;
  player?: string;
  isSelected: boolean;
}) {
  if (player) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-2 bg-primary/20 rounded-lg h-full animate-in fade-in zoom-in-95 cursor-pointer">
        <Image
          src={`https://placehold.co/64x64.png`}
          alt={player}
          width={64}
          height={64}
          className="rounded-full border-2 border-primary"
          data-ai-hint="football player"
        />
        <p className="font-bold text-sm md:text-base text-center text-primary-foreground truncate w-full">
          {player}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer transition-colors",
        isSelected ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-accent/10"
      )}
    />
  );
}
