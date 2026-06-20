import { useAmmo, isAutoMode } from "./hud.js";

const gunOrigPos = new BABYLON.Vector3(0.3, -0.08, 1.5);
const gunOrigRot = new BABYLON.Vector3(0, Math.PI, 0);

let gunMesh: BABYLON.AbstractMesh | null = null;
let muzzleFlash: BABYLON.Mesh | null = null;
let autoInterval: number | null = null;

const semiAudio = new Audio("assets/gunshot.ogg");
semiAudio.volume = 0.5;

const autoAudio = new Audio("assets/spam.ogg");
autoAudio.volume = 0.5;
autoAudio.loop = true;

export function loadWeapon(scene: BABYLON.Scene, camera: BABYLON.UniversalCamera) {
  BABYLON.SceneLoader.ImportMesh("", "assets/", "ak.gltf", scene, (meshes) => {
    gunMesh = meshes[0];
    gunMesh.parent = camera;
    gunMesh.position = gunOrigPos.clone();
    gunMesh.scaling = new BABYLON.Vector3(0.55, 0.55, 0.55);
    gunMesh.rotation = gunOrigRot.clone();

    muzzleFlash = BABYLON.MeshBuilder.CreatePlane("muzzle", { size: 0.2 }, scene);
    muzzleFlash.parent = gunMesh;
    muzzleFlash.position = new BABYLON.Vector3(0.3, -0.4, 1.5);
    muzzleFlash.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    const muzzleMat = new BABYLON.StandardMaterial("muzzleMat", scene);
    muzzleMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2);
    muzzleMat.disableLighting = true;
    muzzleMat.alpha = 0;
    muzzleFlash.material = muzzleMat;
  });
}

function shoot(playSound = true) {
  if (playSound) {
    semiAudio.currentTime = 0;
    semiAudio.play();
  }

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

function fireOnce(scene: BABYLON.Scene, engine: BABYLON.Engine, camera: BABYLON.UniversalCamera, playSound = true) {
  if (!useAmmo()) return;
  shoot(playSound);

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

export function setupShooting(scene: BABYLON.Scene, engine: BABYLON.Engine, camera: BABYLON.UniversalCamera) {
  scene.onPointerObservable.add((pointerInfo) => {
    if (
      pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN &&
      (pointerInfo.event as PointerEvent).button === 0 &&
      document.pointerLockElement
    ) {
      if (isAutoMode()) {
        fireOnce(scene, engine, camera, false);
        autoAudio.currentTime = 0;
        autoAudio.play();
        autoInterval = window.setInterval(() => {
          if (!useAmmo()) {
            if (autoInterval) window.clearInterval(autoInterval);
            autoInterval = null;
            autoAudio.pause();
            return;
          }
          shoot(false);
        }, 100);
      } else {
        fireOnce(scene, engine, camera, true);
      }
    }

    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP) {
      if (autoInterval) {
        window.clearInterval(autoInterval);
        autoInterval = null;
        autoAudio.pause();
      }
    }
  });
}
