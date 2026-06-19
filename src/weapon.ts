const gunOrigPos = new BABYLON.Vector3(0.3, -0.08, 1.5);
const gunOrigRot = new BABYLON.Vector3(0, Math.PI, 0);

let gunMesh: BABYLON.AbstractMesh | null = null;
let muzzleFlash: BABYLON.Mesh | null = null;

const gunshotAudio = new Audio("assets/gunshot.ogg");
gunshotAudio.volume = 0.5;

export function loadWeapon(scene: BABYLON.Scene, camera: BABYLON.UniversalCamera) {
  BABYLON.SceneLoader.ImportMesh("", "assets/", "ak.gltf", scene, (meshes) => {
    gunMesh = meshes[0];
    gunMesh.parent = camera;
    gunMesh.position = gunOrigPos.clone();
    gunMesh.scaling = new BABYLON.Vector3(0.55, 0.55, 0.55);
    gunMesh.rotation = gunOrigRot.clone();

    muzzleFlash = BABYLON.MeshBuilder.CreatePlane("muzzle", { size: 0.2 }, scene);
    muzzleFlash.parent = gunMesh;
    muzzleFlash.position = new BABYLON.Vector3(-1.0, -0.4, -1.85);
    muzzleFlash.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    const muzzleMat = new BABYLON.StandardMaterial("muzzleMat", scene);
    muzzleMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2);
    muzzleMat.disableLighting = true;
    muzzleMat.alpha = 0;
    muzzleFlash.material = muzzleMat;
  });
}

export function shoot() {
  gunshotAudio.currentTime = 0;
  gunshotAudio.play();

  if (muzzleFlash) {
    (muzzleFlash.material as BABYLON.StandardMaterial).alpha = 1;
    setTimeout(() => {
      (muzzleFlash!.material as BABYLON.StandardMaterial).alpha = 0;
    }, 50);
  }

  if (gunMesh) {
    gunMesh.position.z = gunOrigPos.z - 0.15;
    gunMesh.rotation.x = gunOrigRot.x + 0.1;
    setTimeout(() => {
      gunMesh!.position = gunOrigPos.clone();
      gunMesh!.rotation = gunOrigRot.clone();
    }, 80);
  }
}

export function setupShooting(scene: BABYLON.Scene, engine: BABYLON.Engine, camera: BABYLON.UniversalCamera) {
  scene.onPointerObservable.add((pointerInfo) => {
    if (
      pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN &&
      (pointerInfo.event as PointerEvent).button === 0 &&
      document.pointerLockElement
    ) {
      shoot();

      const ray = scene.createPickingRay(
        engine.getRenderWidth() / 2,
        engine.getRenderHeight() / 2,
        BABYLON.Matrix.Identity(),
        camera,
      );
      const hit = scene.pickWithRay(ray);
      if (hit && hit.pickedPoint) {
        const spark = BABYLON.MeshBuilder.CreateSphere("spark", { diameter: 0.15 }, scene);
        spark.position = hit.pickedPoint;
        spark.material = new BABYLON.StandardMaterial("sparkMat", scene);
        (spark.material as BABYLON.StandardMaterial).emissiveColor = new BABYLON.Color3(1, 1, 0);
        setTimeout(() => spark.dispose(), 200);
      }
    }
  });
}
