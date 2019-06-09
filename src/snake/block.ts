import * as constants from "../constants";
import Vector, { iVector } from "./vector";
import { iEntity } from "../interfaces";

export default class Block {
  public position: Vector;
  public width: number = constants.TILE_WIDTH;
  public height: number = constants.TILE_HEIGHT;

  public reserved: number;

  public color: string = "black";
  public opacity: number = 1;

  constructor(position: iVector, reserved: number = 0) {
    this.position = new Vector(position);
    this.reserved = reserved;
  }

  update() {}

  render(context: CanvasRenderingContext2D, died: boolean) {
    !died ? (context.fillStyle = this.color) : (context.fillStyle = "lightgrey");
    context.globalAlpha = this.opacity;
    context.fillRect(this.position.x * constants.TILE_WIDTH, this.position.y * constants.TILE_HEIGHT, constants.TILE_WIDTH, constants.TILE_HEIGHT);
  }
}
