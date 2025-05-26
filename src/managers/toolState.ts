export type ToolType = "select" | "rectangle" | "idle";
export type ToolMode = "move" | "idle";

class ToolState {
  private toolType: ToolType = "idle";
  private toolMode: ToolMode = "idle";
  private pendingMoveStart: boolean = false;

  constructor () {}

  setTool (tool: ToolType): void {
    this.toolType = tool;
  }

  setMode (mode: ToolMode): void {
    this.toolMode = mode;
  }

  getTool (): ToolType {
    return this.toolType;
  }

  getMode (): ToolMode {
    return this.toolMode;
  }

  clearTool (): void {
    this.toolType = 'select';
  }

  clearMode (): void {
    this.toolMode = "idle";
  }

  setPendingMoveStart(value: boolean) {
    this.pendingMoveStart = value;
  }

  getPendingMoveStart() {
    return this.pendingMoveStart;
  }

  clearPendingMoveStart() {
    this.pendingMoveStart = false;
  }
}

const toolState = new ToolState();
export default toolState;