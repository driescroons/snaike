import { iVector } from "./snake/vector";

export interface iEntity {
  render(context: CanvasRenderingContext2D): void;
  update(): void;
  position: iVector;
}
