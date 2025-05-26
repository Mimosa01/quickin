import type { IComponent, IUIElement } from "../interfaces/component.interface.js";
import Component from "./component.js";

export default class Section implements IUIElement {
  private span: HTMLElement;
  private component: Component;

  constructor (headerText: string = 'header') {
    this.component = new Component();
    this.span = document.createElement('span');
    this.span.textContent = headerText;

    this.component.element.classList.add('inspector__section', 'p-inner');
    this.span.classList.add('inspector__header');

    this.component.element.append(this.span);
  }

  getComponent(): IComponent {
    return this.component;
  }
}