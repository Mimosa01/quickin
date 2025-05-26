import type { IUIElement } from "../interfaces/component.interface";
import Component from "./component";
import ListItem from "./listItem";

export type ListItemData = {
  name: string;
  id: string;
};

type Props = {
  onSelect: (id: string) => void;
};

export default class ListObjects implements IUIElement {
  readonly children: Map<string, ListItem> = new Map();
  private onSelect: (id: string) => void;
  private component: Component;

  constructor({ onSelect }: Props) {
    this.component = new Component('ul');
    this.onSelect = onSelect;
    this.component.element.classList.add("list-reset", "list-objects");
  }

  addItem({ name, id }: ListItemData): void {
    const item = new ListItem({ name, id, onSelect: this.onSelect });
    this.children.set(id, item);
    item.getComponent().render(this.component.element);
  }

  removeItem(id: string): void {
    this.children.get(id)?.getComponent().destroy();
    this.children.delete(id);
  }

  selectItem(id: string): void {
    this.children.forEach((item) => {
      item.setSelected(item.id === id);
    });
  }

  getComponent(): Component {
    return this.component;
  }
}
