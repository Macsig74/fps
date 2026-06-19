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

  BABYLON.SceneLoader.ImportMesh(
    "",
    "assets/",
    "ak2.gltf",
    scene,
    (meshes: any[]) => {
      const gun = meshes[0];
      gun.parent = camera;
      gun.position = new BABYLON.Vector3(0.3, -0.08, 1.5);
      gun.scaling = new BABYLON.Vector3(0.55, 0.55, 0.55);
      gun.rotation = new BABYLON.Vector3(0, Math.PI, 0);
    },
  );

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
