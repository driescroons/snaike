import Snake from "./snake";
import * as notify from "pling";
import { Status } from "./snake/snake";
import { State } from "./index";

export default class Manager {
  public snakes: Snake[] = [];

  public alive = 0;

  public highscore = 0;
  public longest = 1;

  public generation = 0;

  public container: HTMLDivElement;

  public canvases: HTMLCanvasElement[];

  public static state: State = {
    populationSize: 100,
    mutationRate: 0.1,
    timeForSnakeToLive: 30,
    moveTowardsScore: 1.5,
    moveAwayFromScore: -0.5,
    eatFoodScore: 30,
    gridSize: 20,
    displaySize: 100,
    lengthOfTick: 1
  };

  constructor(opts: { state: State; canvases: HTMLCanvasElement[] } = { state: undefined, canvases: [] }) {
    // if (opts.container) {
    //   this.container = opts.container;
    // } else {
    //   this.createContainer();
    // }

    this.canvases = opts.canvases;

    if (opts.state) {
      Manager.state = opts.state;
    }

    this.init();
  }

  update = async () => {
    if (this.alive > 0) {
      this.snakes.map(snake => snake.update());
      await new Promise(res => setTimeout(res, Manager.state.lengthOfTick));
      this.update();
    }
  };

  reset = () => {
    this.snakes.forEach(snake => {
      snake.reset();
    });
    this.alive = Manager.state.populationSize;
    this.update();
  };

  init = () => {
    // TODO: clear the parent container on init call
    // while (this.container.firstChild) {
    //   this.container.removeChild(this.container.firstChild);
    // }

    // pass a container in an object to constructor of Snake if you have 1
    // container: document.getElementById("canvas-container") as HTMLCanvasElement
    this.canvases.map(canvas => {
      const snake = new Snake({ container: canvas, manager: this });
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
      // scuffed coding
      await new Promise(res => setTimeout(res, 500));
      await this.nextGeneration();
      this.reset();
    }
  };

  stopSnakes = () => {
    this.snakes.map(snake => (snake.status = Status.stopped));
  };

  nextGeneration = async () => {
    this.calculateFitness(this.snakes);

    notify({
      key: "bf91a89ff7dc64a6d39746d03713b8caec5dd5d0d34830178d9c3a2d8628ad28",
      title: "Highscore & Generation",
      description: JSON.stringify({ generation: this.generation, highscore: this.highscore, length: this.longest, setup: Manager.state })
    });
    console.log(`generation: ${this.generation}`, `highscore: ${this.highscore}`, `length: ${this.longest}`);

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

  stop = () => {
    this.pause();
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

  // fitness means the total "heavy lifting" the specific snake did based on the total amount of points that we're scored in this generation.
  // we calculate the offset (the lowest snake score out of all the generation)
  // we get all of the points
  // for every snake we calculate the fitness by dividing the snakes score (with the offset) by the total sum of points
  calculateFitness = (snakes: Snake[]) => {
    let offset = snakes.reduce((acc, snake) => {
      if (snake.score > this.highscore) {
        this.highscore = snake.score;
        this.longest = snake.body.length;
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

  // createContainer = () => {
  //   const div = document.createElement("div");
  //   div.setAttribute("class", "snakes");

  //   document.body.appendChild(div);
  //   this.container = div;

  //   return div;
  // };

  // createCanvas = () => {
  //   const canvas = document.createElement("canvas");

  //   canvas.setAttribute("class", "canvas");
  //   canvas.setAttribute("width", Manager.state.displaySize as any);
  //   canvas.setAttribute("height", Manager.state.displaySize as any);
  //   canvas.setAttribute("tabindex", 1 as any);

  //   this.container.appendChild(canvas);

  //   return canvas;
  // };
}
