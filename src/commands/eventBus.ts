export type EventMap = {
  "shape:created": { id: string, name: string };
  "shape:selected": { id: string };
  "shapeManager:selected": { id: string };
  "shape:updated": { id: string };
  "shapeManager:updated": { id: string };
};

export class EventBus<Events extends Record<string, any>> {
  private listeners: { [K in keyof Events]?: Array<(data: Events[K]) => void> } = {};

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event]!.filter(fn => fn !== listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    for (const listener of this.listeners[event]!) {
      try {
        listener(data);
      } catch (err) {
        console.error(`Error in listener for event "${String(event)}":`, err);
      }
    }
    
  }
}
