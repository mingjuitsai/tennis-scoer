# tennis-scoer

A Typescript implementation of Tennis scoring system for the coding challange.

## Running locally

1. Install dependencies:

```
npm install
```

2. Run tests:

```
npm test
npm run test:coverage
```

3. Build project:

```
npm run build
```

## Example usage

```typescript
// Create a match with two players
const match = new Match(["player 1", "player 2"]);

// Award points to players
match.pointWonBy("player 1");
match.pointWonBy("player 2");
console.log(match.score()); // "0-0, 15-15"

match.pointWonBy("player 1");
match.pointWonBy("player 1");
console.log(match.score()); // "0-0, 40-15"
```
