declare const BABYLON: any;

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
  scene.collisionsEnabled = true;

  const camera = new BABYLON.UniversalCamera(
    "camera",
    new BABYLON.Vector3(0, 1.8, 0),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.applyGravity = true;
  camera.checkCollisions = true;
  camera.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
  camera.speed = 0.5;
  camera.angularSensibility = 2000;
  camera.minZ = 0.1;

  camera.keysUp = [87]; // Z
  camera.keysDown = [83]; // S
  camera.keysLeft = [65]; // Q
  camera.keysRight = [68]; // D

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene,
  );
  light.intensity = 0.8;

  const dirLight = new BABYLON.DirectionalLight(
    "dirLight",
    new BABYLON.Vector3(-1, -2, 1),
    scene,
  );
  dirLight.intensity = 0.5;

  // Skybox
  const skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 100.0 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMat", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.disableLighting = true;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;
  skybox.infiniteDistance = true;

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 50, height: 50 },
    scene,
  );
  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.3, 0.5, 0.3);
  ground.material = groundMat;
  ground.checkCollisions = true;

  const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
  wallMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock();
  });

  let paused = false;
  const pauseDiv = document.createElement("div");
  pauseDiv.id = "pause";
  pauseDiv.innerHTML = `
    <h1>⏸ Pause</h1>
    <div style="margin:20px 0">
      <label for="sensSlider">Sensibilité: <span id="sensValue">2000</span></label><br>
      <input id="sensSlider" type="range" min="500" max="10000" value="2000" step="100"
        style="width:300px; cursor:pointer; margin-top:8px">
    </div>
    <p>clic pour reprendre</p>
  `;
  pauseDiv.style.cssText = `
    display:none; position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.7); color:white;
    justify-content:center; align-items:center; flex-direction:column;
    font-family:sans-serif; cursor:pointer; z-index:999;
  `;
  document.body.appendChild(pauseDiv);

  document.addEventListener("pointerlockchange", () => {
    if (!document.pointerLockElement) {
      paused = true;
      pauseDiv.style.display = "flex";
    }
  });

  const sensSlider = pauseDiv.querySelector("#sensSlider") as HTMLInputElement;
  const sensValue = pauseDiv.querySelector("#sensValue") as HTMLSpanElement;

  sensSlider.addEventListener("input", (e) => {
    const val = parseInt((e.target as HTMLInputElement).value);
    camera.angularSensibility = 10500 - val;
    sensValue.textContent = String(val);
  });

  sensSlider.addEventListener("click", (e) => e.stopPropagation());

  scene.onPointerObservable.add((pointerInfo: any) => {
    if (
      pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN &&
      pointerInfo.event.button === 0 &&
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
        const spark = BABYLON.MeshBuilder.CreateSphere(
          "spark",
          { diameter: 0.15 },
          scene,
        );
        spark.position = hit.pickedPoint;
        spark.material = new BABYLON.StandardMaterial("sparkMat", scene);
        spark.material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        setTimeout(() => spark.dispose(), 200);
      }
    }
  });

  pauseDiv.addEventListener("click", () => {
    canvas.requestPointerLock();
    paused = false;
    pauseDiv.style.display = "none";
  });

  const createWall = (
    name: string,
    width: number,
    height: number,
    depth: number,
    x: number,
    y: number,
    z: number,
  ) => {
    const wall = BABYLON.MeshBuilder.CreateBox(
      name,
      { width, height, depth },
      scene,
    );
    wall.position = new BABYLON.Vector3(x, y, z);
    wall.material = wallMat;
    wall.checkCollisions = true;
  };

  createWall("wall1", 10, 3, 0.5, 0, 1.5, 5);
  createWall("wall2", 0.5, 3, 8, 5, 1.5, 1);
  createWall("wall3", 6, 3, 0.5, -7, 1.5, -3);
  createWall("wall4", 0.5, 3, 12, -10, 1.5, 2);

  // Son de tir custom
  const gunshotAudio = new Audio("assets/gunshot.ogg");
  gunshotAudio.volume = 0.5;

  let gunMesh: any = null;
  let muzzleFlash: any = null;
  const gunOrigPos = new BABYLON.Vector3(0.3, -0.08, 1.5);
  const gunOrigRot = new BABYLON.Vector3(0, Math.PI, 0);

  BABYLON.SceneLoader.ImportMesh(
    "",
    "assets/",
    "ak.gltf",
    scene,
    (meshes: any[]) => {
      gunMesh = meshes[0];
      gunMesh.parent = camera;
      gunMesh.position = gunOrigPos.clone();
      gunMesh.scaling = new BABYLON.Vector3(0.55, 0.55, 0.55);
      gunMesh.rotation = gunOrigRot.clone();

      // Muzzle flash attaché au bout de l'arme
      muzzleFlash = BABYLON.MeshBuilder.CreatePlane("muzzle", { size: 0.5 }, scene);
      muzzleFlash.parent = gunMesh;
      muzzleFlash.position = new BABYLON.Vector3(0, 0.3, -1.2);
      muzzleFlash.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      const muzzleMat = new BABYLON.StandardMaterial("muzzleMat", scene);
      muzzleMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2);
      muzzleMat.disableLighting = true;
      muzzleMat.alpha = 0;
      muzzleFlash.material = muzzleMat;
    },
  );

  const shoot = () => {
    // Son
    gunshotAudio.currentTime = 0;
    gunshotAudio.play();

    // Muzzle flash
    if (muzzleFlash) {
      (muzzleFlash.material as any).alpha = 1;
      setTimeout(() => { (muzzleFlash.material as any).alpha = 0; }, 50);
    }

    // Recul : l'arme recule vers le joueur et le canon monte
    if (gunMesh) {
      gunMesh.position.z = gunOrigPos.z - 0.15;
      gunMesh.rotation.x = gunOrigRot.x + 0.1;
      setTimeout(() => {
        gunMesh.position = gunOrigPos.clone();
        gunMesh.rotation = gunOrigRot.clone();
      }, 80);
    }
  };

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
