export interface ICommand {
  // marker interface
}

export interface ICommandHandler<T extends ICommand> {
  execute(command: T): void;
}
