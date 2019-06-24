export default {
  populationSize: {
    value: 50,
    label: "Population size",
    description: "The total amount of snake that'll be used to train the neural network for each generation, within the genetic algorithm. Suggested to be as high as your computer is able to."
  },
  mutationRate: {
    value: 0.1,
    label: "Mutation Rate",
    description:
      "The chance the snake will mutate to a snake that had a higher score. Using larger mutation rates will prevent the genetic algorithm from converging more quickly. Suggested value of 0.1 - but do play around with it."
  },
  timeForSnakeToLive: {
    value: 30,
    label: "Snake lifetime",
    description:
      "This mechanic has been added to prevent snakes from idling. The snake has a lifetime, which means he has to eat his next piece of food within that lifetime. Every tick means lifetime - 1. If it reaches 0, the snake automatically dies."
  },
  moveTowardsScore: {
    value: 1.5,
    label: "Move towards score",
    description: "The amount of points the snake gets by moving towards from food."
  },
  moveAwayFromScore: {
    value: -0.5,
    label: "Move away score.",
    description: "The amount of points the snake gets by moving away from food. Suggested to be less than 0."
  },
  eatFoodScore: {
    value: 30,
    label: "Eat food score",
    description: "The amount of points the snake gets by eating the food"
  },
  gridSize: {
    value: 20,
    label: "Grid size",
    description: "The amount of blocks in a game of snake"
  },
  displaySize: {
    value: 100,
    label: "Display size",
    description: "The size of the grid, in pixels"
  },
  lengthOfTick: {
    value: 1,
    label: "Tick length",
    description: "The amount of ticks the game should way before moving the snake again. Suggested to be as low as possible."
  }
};
