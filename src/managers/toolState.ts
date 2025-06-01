export type ToolType = "select" | "rectangle" | "idle";
export type ToolMode = "move" | "resize" | "idle";

class ToolState {
  private toolType: ToolType = "idle";
  private toolMode: ToolMode = "idle";

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
}

const toolState = new ToolState();
export default toolState;