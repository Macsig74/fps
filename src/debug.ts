//Caméra de débug en freeview.
export function createFreeCamera(scene: BABYLON.Scene, canvas: HTMLCanvasElement, playerCamera: BABYLON.UniversalCamera) {
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
      playerCamera.attachControl(canvas, true);
      scene.activeCamera = playerCamera;
    } else if (scene.activeCamera == playerCamera) {
      playerCamera.detachControl();
      camera.attachControl(canvas, true);
      camera.position = playerCamera.position.clone();
      scene.activeCamera = camera;
    }
  });
}