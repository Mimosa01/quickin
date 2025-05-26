import type { IComponent, IUIElement } from "../interfaces/component.interface.js";
import Component from "./component.js";

type InputFieldType = {
  labelText: string;
  type: 'number' | 'text' | 'color';
  value: string;
  onChange: (val: string) => void;
}

export default class InputField implements IUIElement {
  private span: HTMLElement;
  private input: HTMLElement;
  private component: Component;
  private onChange: (val: string) => void;

  constructor ({labelText, type = 'number', value, onChange}: InputFieldType) {
    this.component = new Component('label'); 
    this.span = document.createElement('span');
    this.input = document.createElement('input');
    this.onChange = onChange;

    this.span.textContent = labelText;
    this.component.element.setAttribute('for', labelText);
    this.input.setAttribute('id', labelText);
    this.input.setAttribute('type', type);
    this.input.setAttribute('value', value);

    this.component.element.classList.add('inspector__label');
    this.span.classList.add('inspector__label__span');
    this.input.classList.add('inspector__input');

    this.component.element.append(this.span);
    this.component.element.append(this.input);

    this.input.addEventListener('blur', (e) => {
      const target = e.target as HTMLInputElement;
      let value: string | number = target.value;
      
      if (type === 'number') {
        value = Number(value);
        if (isNaN(value)) return; // защита от ошибок
      }
    
      this.onChange(value.toString());
    });
  }

  getComponent(): IComponent {
    return this.component;
  }

  updateValue(newVal: string): void {
    const inputEl = this.input as HTMLInputElement;
    if (inputEl.value !== newVal) {
      inputEl.value = newVal;
    }
  }
  
}