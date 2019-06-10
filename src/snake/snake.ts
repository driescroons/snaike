import * as tf from "@tensorflow/tfjs";

import Block from "./block";
import Vector, { iVector } from "./vector";
import { NeuralNetwork } from "../brain/brain";
import Manager from "../manager";

export class Direction {
  public static up: iVector = new Vector({ x: 0, y: -1 });
  public static right: iVector = new Vector({ x: 1, y: 0 });
  public static down: iVector = new Vector({ x: 0, y: 1 });
  public static left: iVector = new Vector({ x: -1, y: 0 });
}

// css style
export const directions: iVector[] = [Direction.up, Direction.right, Direction.down, Direction.left];

export class Status {
  public static playing: string = "STATUS_PLAYING";
  public static dying: string = "STATUS_DYING";
  public static dead: string = "STATUS_DEAD";
  public static paused: string = "STATUS_PAUSED";
  public static stopped: string = "STATUS_STOPPED";
}

export default class Snake {
  public width: number;
  public height: number;

  public container: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  public body: Block[] = [];
  public direction: iVector = Direction.up;
  public food: iVector;
  public score: number = 0;
  public fitness: number = 0;
  public status: Status = Status.playing;

  public ttl: number = 0;

  public died: boolean = false;
  public stopped: boolean = false;

  public manager: Manager;
  public brain: NeuralNetwork;

  public history = [];

  constructor(opts: { container?: HTMLCanvasElement; brain?: NeuralNetwork | tf.Sequential; manager: Manager } = { container: undefined, brain: undefined, manager: undefined }) {
    this.width = Manager.state.displaySize;
    this.height = Manager.state.displaySize;

    this.container = opts.container;
    this.manager = opts.manager;

    if (this.container) {
      this.container.focus();
      this.context = this.container.getContext("2d");
    }

    if (!opts.brain) {
      this.brain = new NeuralNetwork(13, 25, 4);
    }
    // else {
    //   if (opts.brain instanceof NeuralNetwork) {
    //     this.brain = opts.brain.copy();
    //   } else {
    //     this.brain = new NeuralNetwork(opts.brain, 8, 25, 4);
    //   }
    // }

    this.init();
    this.render();
  }

  public mutate() {
    this.brain.mutate(Manager.state.mutationRate);
  }

  public dispose() {
    this.brain.dispose();
  }

  public init() {
    this.reset();

    // this.container.onkeydown = e => {
    //   this.controls(e);
    // };
  }

  spawnFood() {
    this.food = new Vector({ x: Math.floor(Math.random() * Manager.state.gridSize), y: Math.floor(Math.random() * Manager.state.gridSize) });
    // check if food is equal to snake of body
    // if so -> recall this method UNTIL we find valid food spot.
    if (this.body.some(block => block.position.equals(this.food))) {
      return this.spawnFood();
    }
  }

  public collisionCheck(position: iVector) {
    return position.x < 0 || position.x > Manager.state.gridSize - 1 || position.y < 0 || position.y > Manager.state.gridSize - 1 || this.body.some(block => block.position.equals(position));
  }

  public async update() {
    // if body exists (longer than 0)
    // let shouldWait;

    if (this.status === Status.stopped) {
      this.stopped = true;
      console.log("force stopped");
    }

    if (this.status === Status.paused) {
      console.log("paused");
    }

    if (this.status === Status.playing) {
      // this.think();
      this.think();

      // check if we're not dead on next step^
      const next = this.body[0].position.clone().add(this.direction);

      if (this.collisionCheck(next) || this.ttl <= 0) {
        this.status = Status.dying;
        return;
        // console.log("DYING", this.ttl > 0 ? "stupid" : "starved");
        // return this.update();
        //return setTimeout(this.update, 100);
        // return this.update();
      }

      // TODO only give points if actually closer to food then previous time...
      if (Math.abs(this.distance(this.food.x, this.food.y, next.x, next.y)) < Math.abs(this.distance(this.food.x, this.food.y, this.body[0].position.x, this.body[0].position.y))) {
        // console.log("getting closer");
        this.addScore(1.5);
      } else {
        this.addScore(-0.5);
      }
      //

      // loop from last block to second block of the body
      // copy i - 1 to i so that every block gets the "next" position
      for (let i = this.body.length - 1; i > 0; i--) {
        let block = this.body[i];
        if (block.reserved === 0) {
          block.position = new Vector(this.body[i - 1].position.clone());
        } else {
          block.reserved--;
        }
      }
      // manually add the direction to the position of the head
      this.body[0].position = next;

      if (next.equals(this.food)) {
        this.eating();
      }

      this.ttl--;

      // this.think();

      // await new Promise(res => setTimeout(res, Manager.state.lengthOfTick));
      // return this.update();
    }

    // just check in playing if we're dead. this is a bit useless go go out of above if to just get in here,
    // to then go in if...
    if (this.status === Status.dying) {
      this.body.forEach(block => {
        block.color = "salmon";
        block.opacity = 1;
      });
      // await new Promise(res => setTimeout(res, Manager.state.lengthOfTick * 5));
      // we could pass snake instance
      this.status = Status.dead;
    }

    if (this.status === Status.dead) {
      if (!this.died) {
        this.manager.died();
        this.died = true;
      }

      // this.reset();
      // return this.update();
    }
  }

  public distance(x1, y1, x2, y2) {
    let xs = x2 - x1;
    let ys = y2 - y1;

    xs *= xs;
    ys *= ys;

    return Math.sqrt(xs + ys);
  }

  public think() {
    const inputs = [];

    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      let next = this.body[0].position.clone().add(direction);
      const collision = this.collisionCheck(next);

      inputs.push(Number(collision));
      inputs.push(Number(next.equals(this.food)));

      let foundFood = false;
      // for (let j = 0; j < Manager.state.gridSize && !foundFood; j++) {
      // console.log(this.body[0].position, j);
      const line = this.body[0].position.clone();
      const distance = this.distance(line.x, line.y, this.food.x, this.food.y);
      line.add(new Vector(direction).multiply(distance));
      if (line.equals(this.food)) {
        inputs.push(Number(true));
        foundFood = true;
      }
      // }
      if (!foundFood) inputs.push(Number(foundFood));
    }

    // optional input -> for big snakes, we could input if there is a clear way ahead (not blocked off) to the food

    // other approach:
    // in every direction, distance to food & distance to collision
    // add relative angle as well?

    // console.log(inputs);

    let deltaX = this.body[0].position.x - this.food.x;
    let deltaY = this.body[0].position.y - this.food.y;

    inputs.push(Math.round(((Math.atan2(deltaY, deltaX) * 180) / 3.14 / 180) * 100) / 100);
    this.direction = this.brain.predict(inputs);

    // push to our history
    // this.history.push(inputs);
  }

  public eating() {
    this.ttl += Manager.state.timeForSnakeToLive;
    this.addScore(30);
    this.addBlockToSnake();
    this.spawnFood();
  }

  public addScore(amount: number) {
    if (!this.died) {
      this.score += amount;
    }
  }

  public reset() {
    // this.brain.fitModel(this.history);
    // this.brain.dispose();

    this.body = [];
    this.history = [];
    this.direction = Direction.up;
    this.score = 0;
    this.status = Status.playing;
    this.stopped = false;
    this.died = false;
    this.ttl = Manager.state.timeForSnakeToLive;
    this.spawnFood();
    this.addBlockToSnake();

    // this.update();
  }

  public render() {
    this.context.clearRect(0, 0, Manager.state.displaySize, Manager.state.displaySize);
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, Manager.state.displaySize, Manager.state.displaySize);

    this.context.fillStyle = "lightgreen";
    this.context.beginPath();
    this.context.arc(
      (this.food.x * Manager.state.displaySize) / Manager.state.gridSize + Manager.state.displaySize / Manager.state.gridSize / 2,
      (this.food.y * Manager.state.displaySize) / Manager.state.gridSize + Manager.state.displaySize / Manager.state.gridSize / 2,
      (Manager.state.displaySize / Manager.state.gridSize / 2) * 0.8,
      0,
      Math.PI * 2
    );
    this.context.fill();

    this.body.forEach(block => {
      block.render(this.context, this.died);
    });

    // when render is invoked via requestAnimationFrame(this.render) there is
    // no 'this', so either we bind it explicitly or use an es6 arrow function.
    // requestAnimationFrame(this.render.bind(this));
    requestAnimationFrame(() => this.render());
  }

  public addBlockToSnake() {
    let block: Block = new Block({ x: Math.ceil(Manager.state.gridSize / 2), y: Math.ceil(Manager.state.gridSize / 2) });
    if (this.body.length > 0) {
      // we could just only reserve them for 1 spot, but since we're able to dynamically add them
      // to the snake, we get reserved of last block and add 1
      const reserved = this.body[this.body.length - 1].reserved + 1;
      block = new Block(this.body[this.body.length - 1].position, reserved);
    }

    this.body.push(block);

    // we're also going to be recalculating the colors of 'em all.
    this.body.forEach((block, index) => (block.opacity = ((this.body.length - index) / this.body.length) * 0.5 + 0.5));
  }

  public controls(e: KeyboardEvent) {
    // TODO: only if keyboard enabled
    switch (e.which) {
      case 37: {
        this.direction = Direction.left;
        this.update();

        break;
      }
      case 38: {
        this.direction = Direction.up;
        this.update();

        break;
      }
      case 39: {
        this.direction = Direction.right;
        this.update();
        break;
      }
      case 40: {
        this.direction = Direction.down;
        this.update();
        break;
      }
      case 32: {
        if (this.status === Status.playing) {
          this.status = Status.paused;
        }
        break;
      }
    }
  }
}
