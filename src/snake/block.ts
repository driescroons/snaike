import Vector, { iVector } from "./vector";
import { iEntity } from "../interfaces";
import Manager from "../manager";

export default class Block {
  public position: Vector;
  public width: number = Manager.state.displaySize / Manager.state.gridSize;
  public height: number = Manager.state.displaySize / Manager.state.gridSize;

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
    context.fillRect(
      (this.position.x * Manager.state.displaySize) / Manager.state.gridSize,
      (this.position.y * Manager.state.displaySize) / Manager.state.gridSize,
      Manager.state.displaySize / Manager.state.gridSize,
      Manager.state.displaySize / Manager.state.gridSize
    );
  }
}
