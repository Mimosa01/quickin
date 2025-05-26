import type { EventBus, EventMap } from "../commands/eventBus";
import type { AllProperties, AllSetters } from "../interfaces/shapeDifinition.interface";
import InputField from "../ui/inputField";
import InspectorWrapper from "../ui/inspectorWrapper";
import Section from "../ui/section";
import type ShapeManager from "./shapeManager";

type Props = {
  shapeManager: ShapeManager,
  eventBus: EventBus<EventMap>,
  container: HTMLElement
}

export default class InspectorProperties {
  private shapeManager: ShapeManager;
  private eventBus: EventBus<EventMap>;
  private container: HTMLElement;
  private fields: Map<string, InputField> = new Map();

  constructor ({ shapeManager, eventBus, container }: Props) {
    this.shapeManager = shapeManager;
    this.eventBus = eventBus;
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
    const type = this.shapeManager.getType();
    const props: AllProperties = this.shapeManager.getProperties(type);
    const setters: AllSetters = this.shapeManager.getSetters(type);
  
    this.container.innerHTML = '';
    const headerSection = new Section(props.general.name);
  
    (Object.entries(props) as [keyof AllProperties, any][]).forEach(([sectionKey, sectionValue]) => {
      if (sectionKey !== 'general') {
        const section = new Section(sectionKey);
        const wrapper = new InspectorWrapper('column');
  
        Object.entries(sectionValue).forEach(([fieldKey, fieldValue]) => {
          const fieldKeyTyped = fieldKey as keyof typeof sectionValue;
          const sectionSetters = setters[sectionKey as keyof AllSetters] as Record<string, (value: string) => void>;
          const setter = sectionSetters[fieldKeyTyped as string];
  
          if (typeof setter === 'function') {
            const input = new InputField({
              labelText: fieldKey[0].toUpperCase(),
              value: String(fieldValue),
              type: 'text',
              onChange: (val: string) => setter(val),
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
    const type = this.shapeManager.getType();
    const props: AllProperties = this.shapeManager.getProperties(type);
  
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