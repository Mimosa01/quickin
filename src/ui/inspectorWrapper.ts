import type { IComponent, IUIElement } from "../interfaces/component.interface.js";
import Component from "./component.js";

export default class InspectorWrapper implements IUIElement {
  private component: Component;

  constructor (direction: 'row' | 'column' = 'row') {
    this.component = new Component();
    this.component.element.classList.add('inspector__wrapper', `inspector__wrapper--${direction}`);
  }

  getComponent(): IComponent {
    return this.component;
  }
}