export type CircleProperties = {
  x: number;
  y: number;
  radius: number;
  fill: string;
}

export default class Circle {
  public x: number;
  public y: number;
  public radius: number;
  public fill: string;

  constructor ({
    x =  100,
    y = 100,
    radius = 50,
    fill = '#000000'
  }: CircleProperties) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fill = fill;
  }
}