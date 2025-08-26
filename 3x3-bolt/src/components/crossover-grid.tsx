
"use client";

import { getTeams, type Team } from "@/lib/teams";
import { GridCell } from "./grid-cell";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { validatePlayerAction, type ValidationState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Loader2, SendHorizonal, Check, ChevronsUpDown } from "lucide-react";
import { crossoverData } from "@/lib/crossoverData";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { cn } from "@/lib/utils";


type SelectedCell = { row: number; col: number } | null;
type Guesses = { [key: string]: string | null };

const initialState: ValidationState = {
  playedForBothTeams: false,
  player: null,
  reason: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Checking...
        </>
      ) : (
        <>
          Guess <SendHorizonal className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

interface CrossoverGridProps {
  rowTeams: Team[];
  colTeams: Team[];
}

export function CrossoverGrid({ rowTeams, colTeams }: CrossoverGridProps) {
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(
    rowTeams.length > 0 && colTeams.length > 0 ? { row: 0, col: 0 } : null
  );

  const [guesses, setGuesses] = useState<Guesses>({});

  const activeRowTeam = selectedCell ? rowTeams[selectedCell.row] : null;
  const activeColTeam = selectedCell ? colTeams[selectedCell.col] : null;

  const validatePlayerActionWithTeams = validatePlayerAction.bind(
    null,
    activeRowTeam?.name ?? '',
    activeColTeam?.name ?? ''
  );

  const [state, formAction] = useActionState(
    validatePlayerActionWithTeams,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const players = useMemo(() => Object.keys(crossoverData).sort().map(player => ({
    value: player.toLowerCase(),
    label: player,
  })), []);

  // Handle case where no teams are available
  if (rowTeams.length === 0 || colTeams.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-destructive mb-2">Unable to Load Grid</h2>
          <p className="text-muted-foreground">
            Could not generate a valid crossover grid. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (state.reason && !state.playedForBothTeams) {
      toast({
        variant: "destructive",
        title: "Incorrect Guess",
        description: state.reason,
      });
    }
    if (state.playedForBothTeams && state.player && selectedCell) {
      const key = `${selectedCell.row}-${selectedCell.col}`;
      setGuesses((prev) => ({ ...prev, [key]: state.player }));
      setValue("");
      // Move to next cell
      if (selectedCell.col < colTeams.length - 1) {
        setSelectedCell({ row: selectedCell.row, col: selectedCell.col + 1 });
      } else if (selectedCell.row < rowTeams.length - 1) {
        setSelectedCell({ row: selectedCell.row + 1, col: 0 });
      } else {
        setSelectedCell(null); // All cells filled or last cell
      }
    }
    formRef.current?.reset();
    inputRef.current?.focus();
  }, [state]);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    inputRef.current?.focus();
  };
  
  const handleFormAction = (formData: FormData) => {
    const playerLabel = players.find(p => p.value === value)?.label;
    if (!playerLabel) {
        toast({
            variant: "destructive",
            title: "Invalid Player",
            description: "Please select a player from the list.",
        });
        return;
    }
    formData.set('player', playerLabel);
    formAction(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2 md:gap-4 p-2 w-full border border-border rounded-xl shadow-lg bg-card/50">
        <div />
        {colTeams.map((team) => (
          <div
            key={team.name}
            className="flex flex-col items-center justify-center p-2 rounded-lg aspect-square text-center"
          >
            <Image
              src={team.logoUrl}
              alt={`${team.name} logo`}
              width={64}
              height={64}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
              data-ai-hint={`${team.name} logo`}
            />
            <span className="text-xs md:text-sm font-semibold mt-1">{team.label}</span>
          </div>
        ))}

        {rowTeams.flatMap((rowTeam, rowIndex) => [
          <div
            key={rowTeam.name}
            className="flex flex-col items-center justify-center p-2 rounded-lg aspect-square text-center"
          >
            <Image
              src={rowTeam.logoUrl}
              alt={`${rowTeam.name} logo`}
              width={64}
              height={64}
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
              data-ai-hint={`${rowTeam.name} logo`}
            />
             <span className="text-xs md:text-sm font-semibold mt-1">{rowTeam.label}</span>
          </div>,
          ...colTeams.map((colTeam, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const player = guesses[key];
            return (
              <div
                key={`${rowTeam.name}-${colTeam.name}`}
                className="bg-card rounded-lg aspect-square shadow-inner"
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                <GridCell
                  rowTeam={rowTeam}
                  colTeam={colTeam}
                  player={player ?? undefined}
                  isSelected={isSelected}
                />
              </div>
            );
          }),
        ])}
      </div>
      {selectedCell !== null && (
        <form
          ref={formRef}
          action={handleFormAction}
          className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 p-2 w-full max-w-md"
        >
          <input type="hidden" name="player" value={value} />
           <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-background/50 border-border h-10 text-base flex-grow"
              >
                {value
                  ? players.find((player) => player.value === value)?.label
                  : "Select player..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput ref={inputRef} placeholder="Search player..." />
                <CommandEmpty>No player found.</CommandEmpty>
                <CommandList>
                <CommandGroup>
                  {players.map((player) => (
                    <CommandItem
                      key={player.value}
                      value={player.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === player.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {player.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <SubmitButton />
        </form>
      )}
       {guesses && Object.keys(guesses).length === 9 && (
         <div className="text-center p-4">
            <h2 className="text-2xl font-bold text-primary">Grid Complete!</h2>
            <p className="text-muted-foreground">Great job finishing the puzzle.</p>
         </div>
       )}
    </div>
  );
}
