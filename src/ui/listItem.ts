import type { IUIElement } from "../interfaces/component.interface";
import Component from "./component";

type Props = {
  name: string;
  id: string;
  onSelect: (id: string) => void;
};

export default class ListItem implements IUIElement {
  readonly id: string;
  private component: Component;
  private button: HTMLButtonElement;
  private onSelect: (id: string) => void;

  constructor({ name, id, onSelect }: Props) {
    this.component = new Component('li');
    this.id = id;
    this.onSelect = onSelect;

    this.component.element.classList.add("list-objects__item");
    this.component.element.setAttribute("data-id", id);

    this.button = document.createElement("button");
    this.button.classList.add("btn-reset");
    this.button.textContent = name;

    this.component.element.append(this.button);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.component.element.addEventListener("click", () => this.onSelect(this.id));
  }

  setSelected(selected: boolean): void {
    this.component.element.classList.toggle("select-item", selected);
  }

  getComponent(): Component {
    return this.component;
  }
}
