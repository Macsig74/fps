import { Settings } from "./settings.js";

export class Player {
  playerCenter: BABYLON.TransformNode;
  cameraPivot: BABYLON.TransformNode;
  
  camera: BABYLON.UniversalCamera;
  characterMesh: BABYLON.Mesh;

  constructor(scene: BABYLON.Scene) {
    this.playerCenter = new BABYLON.TransformNode("center", scene);
    this.playerCenter.position = new BABYLON.Vector3(0, 0, 0);

    this.cameraPivot = new BABYLON.TransformNode("pivot", scene);
    this.cameraPivot.position = new BABYLON.Vector3(0, 1.8, 0);
    this.cameraPivot.parent = this.playerCenter;
    
    this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 0, 0), scene);
    this.camera.minZ = 0.1;
    this.camera.parent = this.cameraPivot;

    this.characterMesh = BABYLON.MeshBuilder.CreateCapsule("characterMesh", { height: 1.8, radius: 0.5}, scene);
    this.characterMesh.position = new BABYLON.Vector3(0, -this.camera.position.y/2, 0);
    this.characterMesh.parent = this.camera;
  }
}

export function createPlayer(scene: BABYLON.Scene, canvas: HTMLCanvasElement, settings: Settings) {
  const player = new Player(scene);
  
  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();          
  });

  scene.onPointerObservable.add((pointerInfo) => {
    const event = pointerInfo.event as PointerEvent;

    if (document.pointerLockElement === canvas) {
      player.playerCenter.rotation.y += event.movementX * settings.mouseSensitivity / 360 * Math.PI / 2;
      player.cameraPivot.rotation.x += event.movementY * settings.mouseSensitivity / 360 * Math.PI / 2;

      player.cameraPivot.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, player.cameraPivot.rotation.x));
    }
  })

  const inputMap: Record<string, boolean> = {};
  
  scene.onKeyboardObservable.add((kbInfo) => {
      const key = kbInfo.event.key.toLowerCase();
  
      if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
          inputMap[key] = true;
      }
  
      if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYUP) {
          inputMap[key] = false;
      }
  });

  scene.onBeforeRenderObservable.add(() => {
  
      const forward = player.playerCenter.forward;
      const right = player.playerCenter.right;
  
      let move = BABYLON.Vector3.Zero();
  
      if (inputMap["w"]) move.addInPlace(forward);
      if (inputMap["s"]) move.subtractInPlace(forward);
      if (inputMap["d"]) move.addInPlace(right);
      if (inputMap["a"]) move.subtractInPlace(right);
  
      move.y = 0;
  
      if (move.lengthSquared() > 0) {
          move.normalize();
        player.playerCenter.position.addInPlace(
              move.scale(settings.playerSpeed * scene.getEngine().getDeltaTime() / 1000)
          );
      }
  });
  
  return player;
}
