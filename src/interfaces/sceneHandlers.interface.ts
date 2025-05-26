export type SceneEventType = "pointerdown" | "pointerup" | "pointermove";
export type GeneralHandlers = Map<SceneEventType, (event: PointerEvent) => void>

export interface ISceneHandler {
  getSceneHandlers: () => GeneralHandlers;
}