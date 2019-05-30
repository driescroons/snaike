import * as constants from "../constants";
import "../styles/index.scss";
import Block from "./block";
import Vector, { iVector } from "./vector";

export class Direction {
  public static up: iVector = new Vector({ x: 0, y: -1 });
  public static right: iVector = new Vector({ x: 1, y: 0 });
  public static down: iVector = new Vector({ x: 0, y: 1 });
  public static left: iVector = new Vector({ x: -1, y: 0 });
}

export class Status {
  public static playing: string = "STATUS_PLAYING";
  public static dying: string = "STATUS_DYING";
  public static dead: string = "STATUS_DEAD";
}

export default class Application {
  public width: number;
  public height: number;

  public container: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  public body: Block[] = [];
  public direction: iVector = Direction.up;
  public food: iVector;
  public score: number = 0;
  public status: Status = Status.playing;

  constructor(opts: { container: HTMLCanvasElement } = { container: undefined }) {
    this.width = constants.WORLD_WIDTH;
    this.height = constants.WORLD_WIDTH;

    if (opts.container) {
      this.container = opts.container;
    } else {
      const canvas = Application.createContainer();
      document.body.appendChild(canvas);
      this.container = canvas;
    }

    this.container.focus();
    this.context = this.container.getContext("2d");

    this.init();
    this.update();
    this.render();
  }

  public init() {
    this.reset();

    this.container.onkeydown = e => {
      this.controls(e);
    };
  }

  spawnFood() {
    this.food = new Vector({ x: Math.floor(Math.random() * constants.COLUMNS), y: Math.floor(Math.random() * constants.ROWS) });
    // check if food is equal to snake of body
    // if so -> recall this method UNTIL we find valid food spot.
    if (this.body.some(block => block.position.equals(this.food))) {
      return this.spawnFood();
    }
  }

  public async update() {
    // if body exists (longer than 0)
    if (this.status === Status.playing) {
      // check if we're not dead on next step^
      const next = this.body[0].position.clone().add(this.direction);
      if (next.x < 0 || next.x > constants.COLUMNS - 1 || next.y < 0 || next.y > constants.ROWS - 1 || this.body.some(block => block.position.equals(next))) {
        this.status = Status.dying;
        return this.update();
      }

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
        this.addBlockToSnake();
        this.spawnFood();
      }

      await new Promise(res => setTimeout(res, constants.TICK));
      return this.update();
    }

    if (this.status === Status.dying) {
      this.body.forEach(block => {
        block.color = "salmon";
        block.opacity = 1;
      });
      await new Promise(res => setTimeout(res, constants.TICK * 5));
      this.status = Status.dead;
    }

    if (this.status === Status.dead) {
      this.reset();
      return this.update();
    }
  }

  public reset() {
    this.body = [];
    this.direction = Direction.up;
    this.score = 0;
    this.status = Status.playing;
    this.spawnFood();
    this.addBlockToSnake();
  }

  public render() {
    this.context.clearRect(0, 0, constants.WORLD_WIDTH, constants.WORLD_HEIGHT);
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, constants.WORLD_WIDTH, constants.WORLD_HEIGHT);

    this.context.fillStyle = "lightgreen";
    this.context.beginPath();
    this.context.arc(this.food.x * constants.TILE_WIDTH + constants.TILE_WIDTH / 2, this.food.y * constants.TILE_HEIGHT + constants.TILE_HEIGHT / 2, (constants.TILE_WIDTH / 2) * 0.8, 0, Math.PI * 2);
    this.context.fill();

    this.body.forEach(block => {
      block.render(this.context);
    });

    // when render is invoked via requestAnimationFrame(this.render) there is
    // no 'this', so either we bind it explicitly or use an es6 arrow function.
    // requestAnimationFrame(this.render.bind(this));
    requestAnimationFrame(() => this.render());
  }

  public addBlockToSnake() {
    let block: Block = new Block({ x: Math.ceil(constants.COLUMNS / 2), y: Math.ceil(constants.ROWS / 2) });
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
    switch (e.which) {
      case 37: {
        if (this.direction !== Direction.right) {
          this.direction = Direction.left;
        }
        break;
      }
      case 38: {
        if (this.direction !== Direction.down) {
          this.direction = Direction.up;
        }
        break;
      }
      case 39: {
        if (this.direction !== Direction.left) {
          this.direction = Direction.right;
        }
        break;
      }
      case 40: {
        if (this.direction !== Direction.up) {
          this.direction = Direction.down;
        }
        break;
      }
      case 32: {
        if (this.status === Status.playing) {
          this.addBlockToSnake();
        }
        break;
      }
    }
  }

  static createContainer() {
    const canvas = document.createElement("canvas");
    // div.setAttribute("id", "canvas-container");
    canvas.setAttribute("class", "canvas");
    canvas.setAttribute("width", constants.WORLD_WIDTH as any);
    canvas.setAttribute("height", constants.WORLD_HEIGHT as any);
    // so we can use key presses
    canvas.setAttribute("tabindex", 1 as any);
    return canvas;
  }
}
