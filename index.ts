type MatchParams = [string, string];

const pointToDisplay = ["0", "15", "30", "40"];

class Match {
  private player1: string;
  private player2: string;
  private player1Points: number = 0;
  private player2Points: number = 0;
  private p1Games: number = 0;
  private p2Games: number = 0;
  private tieBreakActive: boolean = false;
  private p1TieBreakPoints: number = 0;
  private p2TieBreakPoints: number = 0;

  constructor([player1, player2]: MatchParams) {
    this.player1 = player1;
    this.player2 = player2;
  }

  pointWonBy(player: string): void {
    if (this.tieBreakActive) {
      this.handleTieBreakPoint(player);
      return;
    }

    if (player === this.player1) {
      this.player1Points++;
    } else if (player === this.player2) {
      this.player2Points++;
    } else {
      throw new Error("Invalid player name");
    }

    this.checkGameWin();
  }

  private handleTieBreakPoint(player: string): void {
    if (player === this.player1) {
      this.p1TieBreakPoints++;
    } else if (player === this.player2) {
      this.p2TieBreakPoints++;
    } else {
      throw new Error("Invalid player name");
    }

    // Check if tie-break is won using helper function
    this.checkTieBreakWin();
  }

  private checkTieBreakWin(): void {
    // Check player 1 win condition
    if (this.hasTieBreakWon(this.p1TieBreakPoints, this.p2TieBreakPoints)) {
      this.p1Games++;
      this.resetTieBreak();
    }
    // Check player 2 win condition
    else if (
      this.hasTieBreakWon(this.p2TieBreakPoints, this.p1TieBreakPoints)
    ) {
      this.p2Games++;
      this.resetTieBreak();
    }
  }

  private hasTieBreakWon(
    playerPoints: number,
    opponentPoints: number
  ): boolean {
    return playerPoints >= 7 && playerPoints - opponentPoints >= 2;
  }

  private resetTieBreak(): void {
    this.tieBreakActive = false;
    this.p1TieBreakPoints = 0;
    this.p2TieBreakPoints = 0;
  }

  // Check if any player has won the game
  private checkGameWin(): void {
    // Check player 1 win condition
    if (this.hasGameWon(this.player1Points, this.player2Points)) {
      this.p1Games++;
      this.resetGamePoints();
      this.checkSetStatus();
    }
    // Check player 2 win condition
    else if (this.hasGameWon(this.player2Points, this.player1Points)) {
      this.p2Games++;
      this.resetGamePoints();
      this.checkSetStatus();
    }
  }

  private hasGameWon(playerPoints: number, opponentPoints: number): boolean {
    return playerPoints >= 4 && playerPoints - opponentPoints >= 2;
  }

  private resetGamePoints(): void {
    this.player1Points = 0;
    this.player2Points = 0;
  }

  private checkSetStatus(): void {
    // Check for 6-6, activate tie-break
    if (this.p1Games === 6 && this.p2Games === 6) {
      this.tieBreakActive = true;
      return;
    }

    // Check if a player has won the set. 6-2 scenario
    if (
      (this.p1Games >= 6 && this.p1Games >= this.p2Games + 2) ||
      (this.p2Games >= 6 && this.p2Games >= this.p1Games + 2)
    ) {
      // Set is over
      return;
    }

    // Check if a player has won the set. 7-5 scenario
    if (
      (this.p1Games === 7 && this.p2Games === 5) ||
      (this.p2Games === 7 && this.p1Games === 5)
    ) {
      // Set is over
      return;
    }
  }

  score(): string {
    // If tie-break is active, show tie-break score
    if (this.tieBreakActive) {
      return `${this.p1Games}-${this.p2Games}, ${this.p1TieBreakPoints}-${this.p2TieBreakPoints}`;
    }

    // Return only set score if a game is complete or hasn't started
    if (this.player1Points === 0 && this.player2Points === 0) {
      return `${this.p1Games}-${this.p2Games}`;
    }

    // returning current game score
    const gameScore = this.calculateGameScore();
    return `${this.p1Games}-${this.p2Games}, ${gameScore}`;
  }

  private calculateGameScore(): string {
    // Handle regular scoring
    if (
      this.player1Points < 3 ||
      this.player2Points < 3 ||
      (this.player1Points === 3 && this.player2Points < 3) ||
      (this.player2Points === 3 && this.player1Points < 3)
    ) {
      return `${pointToDisplay[this.player1Points]}-${
        pointToDisplay[this.player2Points]
      }`;
    }

    // Handle deuce
    if (this.player1Points === this.player2Points) {
      return "Deuce";
    }

    // Handle advantage
    const leadingPlayer =
      this.player1Points > this.player2Points ? this.player1 : this.player2;
    return `Advantage ${leadingPlayer}`;
  }
}

// Example usage as per requirements
const match = new Match(["player 1", "player 2"]);
console.log(match.score());
match.pointWonBy("player 1");
match.pointWonBy("player 2");
console.log(match.score()); // "0-0, 15-15"

match.pointWonBy("player 1");
match.pointWonBy("player 1");
console.log(match.score()); // "0-0, 40-15"

match.pointWonBy("player 2");
match.pointWonBy("player 2");
console.log(match.score()); // "0-0, Deuce"

match.pointWonBy("player 1");
console.log(match.score()); // "0-0, Advantage player 1"

match.pointWonBy("player 1");
console.log(match.score()); // "1-0"

export { Match };
