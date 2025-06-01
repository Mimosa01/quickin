import { CommandBus } from "../commands/commandBus";
import type { EventBus, EventMap } from "../commands/eventBus";
import { SelectCommand } from "../commands/command/selectCommand";
import ListObjects from "../ui/listObjects";

export default class LayersWindow {
  private container: HTMLElement;
  private mainList: ListObjects;
  private commandBus: CommandBus;
  private eventBus: EventBus<EventMap>;

  constructor(container: HTMLElement, commandBus: CommandBus, eventBus: EventBus<EventMap>) {
    this.container = container;
    this.commandBus = commandBus;
    this.eventBus = eventBus;

    this.mainList = new ListObjects({
      onSelect: (id) => {
        this.commandBus.execute(new SelectCommand(id));
      },
    });

    this.eventBus.on("shape:selected", ({ id }) => {
      this.mainList.selectItem(id);
    });

    this.eventBus.on("shape:created", ({ id, name }) => {
      this.addItem({ id: id, name: name });
    });

    this.mainList.getComponent().render(this.container);
  }

  addItem({ name, id }: { name: string; id: string }): void {
    this.mainList.addItem({ name, id });
  }

  removeItem(id: string): void {
    this.mainList.removeItem(id);
  }
}
