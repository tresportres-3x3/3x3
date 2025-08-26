
import { crossoverData } from './crossoverData';

export type Team = {
  name: string;
  label: string;
  logoUrl: string;
};

function getUniqueTeams(): string[] {
  const allTeams = new Set<string>();
  for (const player in crossoverData) {
    const teams = crossoverData[player as keyof typeof crossoverData];
    if (Array.isArray(teams)) {
      teams.forEach(team => allTeams.add(team));
    }
  }
  return Array.from(allTeams);
}


function selectRandomTeams(teams: string[], count: number, exclude: string[] = []): string[] {
  const availableTeams = teams.filter(t => !exclude.includes(t));
  const shuffled = [...availableTeams].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function countCrossoverPlayers(team1: string, team2: string): number {
    let count = 0;
    for (const player in crossoverData) {
        const teams = crossoverData[player as keyof typeof crossoverData];
        if (teams.includes(team1) && teams.includes(team2)) {
            count++;
        }
    }
    return count;
}

const uniqueTeams = getUniqueTeams();

export function getTeams() {
  let rowTeamNames: string[] = [];
  let colTeamNames: string[] = [];
  let isValidGrid = false;
  const minPlayersPerCell = 3;
  let attempts = 0;

  while (!isValidGrid && attempts < 100) {
    rowTeamNames = selectRandomTeams(uniqueTeams, 3);
    colTeamNames = selectRandomTeams(uniqueTeams, 3, rowTeamNames);

    if (rowTeamNames.length < 3 || colTeamNames.length < 3) {
      attempts++;
      continue;
    }

    isValidGrid = true; // Assume true until a cell fails the check
    for (const rowTeam of rowTeamNames) {
      for (const colTeam of colTeamNames) {
        if (countCrossoverPlayers(rowTeam, colTeam) < minPlayersPerCell) {
          isValidGrid = false;
          break;
        }
      }
      if (!isValidGrid) {
        break;
      }
    }
    attempts++;
  }

  if (!isValidGrid) {
    // Fallback for when a valid grid isn't found after many attempts
    console.warn("Could not generate a grid with 3+ players per cell. Using a potentially unsolvable grid.");
  }
  
  const mapToTeamObject = (name: string): Team => ({
      name,
      label: name,
      logoUrl: `https://placehold.co/100x100.png`,
  });

  return {
    rowTeams: rowTeamNames.map(mapToTeamObject),
    colTeams: colTeamNames.map(mapToTeamObject),
  };
}
