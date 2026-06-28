import { Scene } from "babylonjs";
import { UniversalCamera } from "babylonjs/Cameras/pure";
import { DebugLayer } from "babylonjs/Debug/debugLayer";

//Caméra de débug en freeview.
function createFreeCamera(scene: BABYLON.Scene, canvas: HTMLCanvasElement, playerCamera: BABYLON.UniversalCamera) {
  const camera = new BABYLON.UniversalCamera("freeCamera", new BABYLON.Vector3(0, 0, 0), scene);
  camera.position = new BABYLON.Vector3(0, 3, 0);
  camera.speed = 0.5;
  camera.angularSensibility = 2000;

  camera.keysUp = [87];    // W
  camera.keysDown = [83];  // S
  camera.keysLeft = [65];  // A
  camera.keysRight = [68]; // D

  document.addEventListener("keydown", (event) => {
    if (event.key !== "f") return;
    
    if (scene.activeCamera == camera) {
      camera.detachControl();
      // playerCamera.attachControl(canvas, true);
      scene.activeCamera = playerCamera;
    } else if (scene.activeCamera == playerCamera) {
      playerCamera.detachControl();
      camera.attachControl(canvas, true);
      camera.position = playerCamera.position.clone();
      scene.activeCamera = camera;
    }
  });

  return camera;
}

function createDebugLayer(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
  const debugLayer = new BABYLON.DebugLayer(scene);
  canvas.addEventListener("keydown", (event) => {
    if (event.key !== "h") return;
    if (debugLayer.isVisible()) debugLayer.hide()
    else debugLayer.show();
  });
}

export function enableDebugTools(scene: BABYLON.Scene, canvas: HTMLCanvasElement, camera: BABYLON.UniversalCamera) {
  createFreeCamera(scene, canvas, camera);
  createDebugLayer(scene, canvas);
}