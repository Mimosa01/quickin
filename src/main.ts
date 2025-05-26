import { AddShapeCommand } from "./commands/addShapeCommand";
import { AddShapeCommandHandler } from "./commands/addShapeCommandHandler";
import { CommandBus } from "./commands/commandBus";
import { EventBus } from "./commands/eventBus";
import MoveCommand from "./commands/MoveCommand";
import MoveCommandHandler from "./commands/MoveCommandHandler";
import { SelectCommand } from "./commands/selectCommand";
import { SelectCommandHandler } from "./commands/selectCommandHandler";
import InspectorProperties from "./managers/inspectorProperties";
import LayersWindow from "./managers/layersWindow";
import ShapeManager from "./managers/shapeManager";
import toolState from "./managers/toolState";
import SceneHandler from "./strategies/sceneHandlers";
import SceneUI from "./ui/scene";

const rootLayers = document.getElementById('layers');
const rootInspector = document.getElementById('inspector');
const rectBtn = document.getElementById('rectButton');
const rootScene = document.getElementById('scene');

const eventBus = new EventBus();
const commandBus = new CommandBus();
const manager = new ShapeManager(eventBus);
const sceneHandler = new SceneHandler(commandBus, eventBus, manager.getShapePosition.bind(manager));

const layersWindow = new LayersWindow(rootLayers as HTMLElement, commandBus, eventBus);
const inspector = new InspectorProperties({
  shapeManager: manager,
  eventBus: eventBus,
  container: rootInspector as HTMLElement
});
const scene = new SceneUI({
  container: rootScene as HTMLElement, 
  handlers: sceneHandler,
  eventBus: eventBus,
  shapeManager: manager,
  commandBus: commandBus
});

commandBus.register(SelectCommand.type, new SelectCommandHandler(manager));
commandBus.register(AddShapeCommand.type, new AddShapeCommandHandler(manager));
commandBus.register(MoveCommand.type, new MoveCommandHandler(manager));

rectBtn?.addEventListener("click", () => {
  toolState.setTool('rectangle');
});

void layersWindow;
void inspector;
void scene;
