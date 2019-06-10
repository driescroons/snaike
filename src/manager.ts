import Snake from "./snake";
import * as constants from "./constants";
import { Status } from "./snake/snake";

export default class Manager {
  public snakes: Snake[] = [];

  public alive = 0;
  public amount = 100;

  public highscore = 0;

  public generation = 0;

  constructor() {
    this.init();
  }

  update = async () => {
    if (this.alive > 0) {
      this.snakes.map(snake => snake.update());
      await new Promise(res => setTimeout(res, constants.TICK));
      this.update();
    }
  };

  reset = () => {
    // REUSE containers from dom?
    // reset snakes
    // use new improved brains

    this.snakes.forEach(snake => {
      // snake.dispose();
      snake.reset();
    });
    this.alive = this.amount;
    this.update();
  };

  init = () => {
    // document.body.onkeydown = e => {
    //   this.controls(e);
    // };

    // pass a container in an object to constructor of Snake if you have 1
    // container: document.getElementById("canvas-container") as HTMLCanvasElement
    [...Array(this.amount)].map((_, i) => {
      //
      const snake = new Snake({ container: createContainer(), manager: this });
      this.snakes.push(snake);
    });
    this.reset();
  };

  died = async () => {
    if (this.alive > 0) {
      this.alive -= 1;
    }

    if (this.alive <= 0) {
      // waiting for everyone to stop
      this.stopSnakes();

      // we need to wait for everyone to be stopped stop..
      await new Promise(res => setTimeout(res, 500));
      this.nextGeneration();
      this.reset();
    }
  };

  stopSnakes = () => {
    this.snakes.map(snake => (snake.status = Status.stopped));
  };

  nextGeneration = () => {
    this.calculateFitness(this.snakes);

    console.log(`generation: ${this.generation}`, `highscore: ${this.highscore}`);

    this.generation++;
    this.snakes.map(snake => {
      let index = 0;
      let r = Math.random();
      while (r > 0) {
        r = r - this.snakes[index].fitness;
        index++;
      }
      index--;
      let bird = this.snakes[index];
      snake.brain = bird.brain.copy();
      snake.mutate();
      return snake;
    });
  };

  pause = () => {
    // we need to be able to go to status - 1 AFTER unpause
    this.snakes.map(snake => (snake.status = Status.paused));
  };

  public controls(e: KeyboardEvent) {
    switch (e.which) {
      case 32: {
        this.pause();
        break;
      }
    }
  }

  // we want to get a mutation of the top % brains
  // how do we do this?
  // we generate a random number (.68)
  // we substract that random number with fitness scores
  // the last r above 0 -> our index
  // we'll copy that snake -> mutate it a bit
  // -> set that brain to new snake

  // should we get nth power percentage?
  // the

  // fitness means the total "heavy lifting" the specific snake did based on the total amount of points that we're scored in this generation.
  // we calculate the offset (the lowest snake score out of all the generation)
  // we get all of the points
  // for every snake we calculate the fitness by dividing the snakes score (with the offset) by the total sum of points
  calculateFitness = (snakes: Snake[]) => {
    let offset = snakes.reduce((acc, snake) => {
      if (snake.score > this.highscore) {
        this.highscore = snake.score;
      }
      if (snake.score < acc) {
        return snake.score;
      }
      return acc;
    }, Infinity);
    offset = Math.abs(offset);

    let sum = 0;
    snakes.forEach(snake => void (sum += snake.score + offset));
    snakes.forEach(snake => {
      snake.fitness = (snake.score + offset) / sum;
    });
  };
}

const createContainer = () => {
  const canvas = document.createElement("canvas");
  // div.setAttribute("id", "canvas-container");
  canvas.setAttribute("class", "canvas");
  canvas.setAttribute("width", constants.WORLD_WIDTH as any);
  canvas.setAttribute("height", constants.WORLD_HEIGHT as any);
  // so we can use key presses
  canvas.setAttribute("tabindex", 1 as any);

  document.body.appendChild(canvas);
  this.container = canvas;

  return canvas;
};
