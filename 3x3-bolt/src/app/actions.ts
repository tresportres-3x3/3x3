
"use server";

import { crossoverData } from "@/lib/crossoverData";
import { z } from "zod";

export type ValidationState = {
  playedForBothTeams: boolean;
  player: string | null;
  reason: string | null;
};

const playerSchema = z
  .string()
  .min(1, { message: "Player name cannot be empty." });

// This function directly checks the crossoverData without using an AI model.
function validatePlayerForTeams(
  player: string,
  team1: string,
  team2: string
): ValidationState {
  const playerTeams = crossoverData[player];

  if (!playerTeams) {
    return {
      playedForBothTeams: false,
      player: player,
      reason: `Player "${player}" not found in our database.`,
    };
  }

  const playedForTeam1 = playerTeams.includes(team1);
  const playedForTeam2 = playerTeams.includes(team2);

  if (playedForTeam1 && playedForTeam2) {
    return {
      playedForBothTeams: true,
      player: player,
      reason: `${player} has played for both ${team1} and ${team2}.`,
    };
  } else {
    let reason = `${player} has not played for both teams.`;
    if (!playedForTeam1 && !playedForTeam2) {
      reason = `${player} did not play for ${team1} or ${team2}.`;
    } else if (!playedForTeam1) {
      reason = `${player} did not play for ${team1}.`;
    } else {
      reason = `${player} did not play for ${team2}.`;
    }
    return {
      playedForBothTeams: false,
      player: player,
      reason: reason,
    };
  }
}


export async function validatePlayerAction(
  team1: string,
  team2: string,
  prevState: ValidationState,
  formData: FormData
): Promise<ValidationState> {
  const validatedFields = playerSchema.safeParse(formData.get("player"));

  if (!validatedFields.success) {
    return {
      playedForBothTeams: false,
      player: null,
      reason: validatedFields.error.errors[0].message,
    };
  }

  const player = validatedFields.data;
  
  try {
    const result = validatePlayerForTeams(player, team1, team2);
    return result;
  } catch (error) {
    console.error(error);
    return {
        playedForBothTeams: false,
        player: null,
        reason: "An error occurred while validating the player.",
    }
  }
}
