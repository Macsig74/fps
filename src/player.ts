export function createPlayer(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
  const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 1.8, 0), scene);
  camera.attachControl(canvas, true);
  camera.applyGravity = true;
  camera.checkCollisions = true;
  camera.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
  camera.speed = 0.5;
  camera.angularSensibility = 2000;
  camera.minZ = 0.1;

  camera.keysUp = [87];    // W
  camera.keysDown = [83];  // S
  camera.keysLeft = [65];  // A
  camera.keysRight = [68]; // D

  const characterMesh = BABYLON.MeshBuilder.CreateCapsule("characterMesh", { height: 1.8, radius: 0.5}, scene);
  characterMesh.position = new BABYLON.Vector3(0, 1, 0);
  characterMesh.parent = camera;

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  return camera;
}
