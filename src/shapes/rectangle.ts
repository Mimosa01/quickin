export default class Rectangle {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public fill: string;
  public cornerRadius: number;
  public name: string;
  public zIndex: number;
  readonly id: string;
  readonly type: 'Rectangle' = 'Rectangle';

  constructor ({
    x = 100,
    y = 100,
    width = 100,
    height = 100,
    fill = '#000000',
    cornerRadius = 0,
    zIndex = 1,
    name = 'Untitled'
  }: Partial<Omit<Rectangle, 'id'>> = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.cornerRadius = cornerRadius;
    this.id = crypto.randomUUID(); 
    this.name = name;
    this.zIndex = zIndex
  }
}
