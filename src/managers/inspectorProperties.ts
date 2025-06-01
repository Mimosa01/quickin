import type { CommandBus } from "../commands/commandBus";
import type { EventBus, EventMap } from "../commands/eventBus";
import type { IShapeProperties, IShapeSetters } from "../interfaces/shape.interface";
import InputField from "../ui/inputField";
import InspectorWrapper from "../ui/inspectorWrapper";
import Section from "../ui/section";
import { moveShape } from "../utils/tarnsform/moveShape";
import type ShapeManager from "./shapeManager";

type Props = {
  shapeManager: ShapeManager,
  eventBus: EventBus<EventMap>,
  commandBus: CommandBus,
  container: HTMLElement
}

export default class InspectorProperties {
  private shapeManager: ShapeManager;
  private eventBus: EventBus<EventMap>;
  private commandBus: CommandBus;
  private container: HTMLElement;
  private fields: Map<string, InputField> = new Map();

  constructor ({ shapeManager, eventBus, commandBus, container }: Props) {
    this.shapeManager = shapeManager;
    this.eventBus = eventBus;
    this.commandBus = commandBus;
    this.container = container;

    this.eventBus.on("shape:selected", () => {
      this.render();
    });

    this.eventBus.on("shape:updated", ({ id }) => {
      if (id === this.shapeManager.getCurrentId()) {
        this.updateInputs();
      }
    });
    

    this.render();
  }

  render(): void {
    const props: IShapeProperties = this.shapeManager.getProperties();
    const setters: IShapeSetters = this.shapeManager.getSetters();
  
    this.container.innerHTML = '';
    const headerSection = new Section(props.general.name);
  
    if (props.general.type === "NullShape") return;
    (Object.entries(props) as [keyof IShapeProperties, any][]).forEach(([sectionKey, sectionValue]) => {
      if (sectionKey !== 'general') {
        const section = new Section(sectionKey);
        const wrapper = new InspectorWrapper('column');
  
        Object.entries(sectionValue).forEach(([fieldKey, fieldValue]) => {
          const fieldKeyTyped = fieldKey as keyof typeof sectionValue;
          const sectionSetters = setters[sectionKey as keyof IShapeSetters] as Record<string, (value: string | number) => void>;
          const setter = sectionSetters[fieldKeyTyped as string];
  
          if (typeof setter === 'function') {
            const isNumber = typeof fieldValue === 'number';
            
            const input = new InputField({
              labelText: fieldKey[0].toUpperCase(),
              value: String(fieldValue),
              type: 'text',
              onChange: (val: string) => {
                const currentId = this.shapeManager.getCurrentId();
                const from = this.shapeManager.getProperties().position;
                setter(isNumber ? Number(val) : val);
                const to = this.shapeManager.getProperties().position;
              
                if (sectionKey === "position" && (fieldKey === "x" || fieldKey === "y")) {
                  moveShape(this.commandBus, from, to);
                }
              
                this.eventBus.emit("shape:updated", { id: currentId });
              },
            });
  
            const key = `${sectionKey}.${fieldKey}`;
            this.fields.set(key, input);

            input.getComponent().render(wrapper.getComponent().element);
          }
        });
  
        wrapper.getComponent().render(section.getComponent().element);
        section.getComponent().render(headerSection.getComponent().element);
      }
    });
  
    headerSection.getComponent().render(this.container);
  }

  private updateInputs(): void {
    const props: IShapeProperties = this.shapeManager.getProperties();
  
    for (const [sectionKey, sectionValue] of Object.entries(props)) {
      for (const [fieldKey, fieldValue] of Object.entries(sectionValue)) {
        const key = `${sectionKey}.${fieldKey}`;
        const input = this.fields.get(key);
        if (input) {
          input.updateValue(String(fieldValue));
        }
      }
    }
  }
}