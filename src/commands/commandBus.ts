import type { ICommandHandler, ICommand } from "../interfaces/command.interface";

export class CommandBus {
  private handlers: Map<string, ICommandHandler<ICommand>> = new Map();

  register<T extends ICommand>(commandName: string, handler: ICommandHandler<T>): void {
    this.handlers.set(commandName, handler as ICommandHandler<ICommand>);
  }

  execute(command: ICommand): void {
    const commandName = (command.constructor as any).type;

    const handler = this.handlers.get(commandName);
    if (handler) {
      try {
        handler.execute(command);
      } catch (err) {
        console.error(`Error while executing command ${command.constructor.name}:`, err);
      }
    } else {
      console.warn(`No handler registered for command: ${command.constructor.name}`);
    }
  }
}
