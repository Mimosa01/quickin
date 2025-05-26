export interface IComponent {
  readonly element: HTMLElement,
  render (element: HTMLElement): void;
  destroy (): void;
}

export interface IUIElement {
  getComponent (): IComponent;
}