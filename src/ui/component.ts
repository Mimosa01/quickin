import type { IComponent } from "../interfaces/component.interface";


export default class Component implements IComponent {
  readonly element: HTMLElement;

  constructor (tag: string = 'div') {
    this.element = document.createElement(tag);
  }

  render (parent: HTMLElement): void {
    if (this.element) {
      parent.append(this.element);
    }
  }

  destroy (): void {
    this.element.remove();
  }
}