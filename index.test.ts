import { describe, test, expect, beforeEach } from "vitest";
import { Match } from "./index";

// Basic tests for the tennis scoring system
describe("Tennis Scoring", () => {
  let match: Match;

  beforeEach(() => {
    match = new Match(["player 1", "player 2"]);
  });

  // Helper to win a game quickly
  function winGame(player: string) {
    for (let i = 0; i < 4; i++) {
      match.pointWonBy(player);
    }
  }

  // Test basic scoring scenarios
  test("basic point scoring works", () => {
    // New match starts
    expect(match.score()).toBe("0-0");

    match.pointWonBy("player 1");
    expect(match.score()).toBe("0-0, 15-0");

    match.pointWonBy("player 1");
    expect(match.score()).toBe("0-0, 30-0");

    match.pointWonBy("player 2");
    expect(match.score()).toBe("0-0, 30-15");
  });

  // Test winning a game
  test("player can win a game and score updates", () => {
    match.pointWonBy("player 1");
    match.pointWonBy("player 1");
    match.pointWonBy("player 1");
    match.pointWonBy("player 1");
    expect(match.score()).toBe("1-0");

    // next game
    match.pointWonBy("player 2");
    expect(match.score()).toBe("1-0, 0-15");
  });

  // Test deuce scenarios
  test("deuce and advantage scoring works", () => {
    // Deuce
    match.pointWonBy("player 1");
    match.pointWonBy("player 1");
    match.pointWonBy("player 1");
    match.pointWonBy("player 2");
    match.pointWonBy("player 2");
    match.pointWonBy("player 2");
    expect(match.score()).toBe("0-0, Deuce");

    // Advantage
    match.pointWonBy("player 1");
    expect(match.score()).toBe("0-0, Advantage player 1");

    // Deuce
    match.pointWonBy("player 2");
    expect(match.score()).toBe("0-0, Deuce");

    // Advantage player 2
    match.pointWonBy("player 2");
    expect(match.score()).toBe("0-0, Advantage player 2");

    // Win from advantage
    match.pointWonBy("player 2");
    expect(match.score()).toBe("0-1");
  });

  // Test set winning rules
  test("set scoring works with 6 games needed to win", () => {
    // player 1 win 5 games
    for (let i = 0; i < 5; i++) {
      winGame("player 1");
    }
    expect(match.score()).toBe("5-0");

    // player 1 win the set
    winGame("player 1");
    expect(match.score()).toBe("6-0");
  });

  // 6-5 edge case
  test("player needs to win by 2 games after 6-5", () => {
    for (let i = 0; i < 6; i++) {
      winGame("player 1");
    }
    for (let i = 0; i < 5; i++) {
      winGame("player 2");
    }
    expect(match.score()).toBe("6-5");

    // Player 1 wins 7-5
    winGame("player 1");
    expect(match.score()).toBe("7-5"); // should be 7-5 but might be a bug here
  });

  // tie-break test
  test("tie-break activates at 6-6", () => {
    // Get to 6-6
    for (let i = 0; i < 6; i++) {
      winGame("player 1");
    }
    for (let i = 0; i < 6; i++) {
      winGame("player 2");
    }

    // First point in tie-break
    match.pointWonBy("player 1");
    expect(match.score()).toBe("6-6, 1-0"); // Score in tie-break is 1-0

    // More tie-break points
    match.pointWonBy("player 2");
    expect(match.score()).toBe("6-6, 1-1");
  });

  // Test requirements examples
  test("matches the example cases", () => {
    match.pointWonBy("player 1");
    match.pointWonBy("player 2");
    expect(match.score()).toBe("0-0, 15-15");

    match.pointWonBy("player 1");
    match.pointWonBy("player 1");
    expect(match.score()).toBe("0-0, 40-15");

    match.pointWonBy("player 2");
    match.pointWonBy("player 2");
    expect(match.score()).toBe("0-0, Deuce");

    match.pointWonBy("player 1");
    expect(match.score()).toBe("0-0, Advantage player 1");

    match.pointWonBy("player 1");
    expect(match.score()).toBe("1-0");
  });
});
