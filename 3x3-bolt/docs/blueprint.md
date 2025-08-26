# **App Name**: Crossover XI

## Core Features:

- Team Grid: Display a grid with team logos as rows and columns. The cells at the intersection of each row and column will be blank to start, ready for the user's input.
- Player Guess Input: Text input box for users to guess a player who has played for both teams in a given cell.
- Player Image Display: A display under each cell for an avatar or image of the user-guessed player. This can either be shown once the correct guess is submitted, or on submission of any guess (right or wrong).
- Player Validation: After a player name is entered, validates whether a given player has played for both teams represented by the cell. A tool decides, after an LLM evaluates the available evidence, if a player actually played for both teams.

## Style Guidelines:

- Primary color: #51A3A3 (a desaturated cyan for a clean look)
- Background color: #232A2A (a dark gray to emphasize the grid)
- Accent color: #A35151 (a brick red, brighter than the primary for contrast)
- Font: 'Inter', a sans-serif font, for all UI elements. It provides a modern, neutral appearance, ideal for displaying team names and player inputs.
- The grid should be responsive, adapting to different screen sizes. Use clear spacing between grid cells.
- Use simple, clear icons for actions like submitting a guess, with a style similar to the team logos (flat, vector-based).