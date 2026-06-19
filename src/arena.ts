export function createArena(scene: BABYLON.Scene) {
  // Skybox
  const skybox = BABYLON.MeshBuilder.CreateBox("skybox", { size: 100.0 }, scene);
  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMat", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.disableLighting = true;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skybox.material = skyboxMaterial;
  skybox.infiniteDistance = true;

  // Sol
  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  groundMat.diffuseColor = new BABYLON.Color3(0.3, 0.5, 0.3);
  ground.material = groundMat;
  ground.checkCollisions = true;

  // Murs
  const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
  wallMat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);

  const createWall = (name: string, width: number, height: number, depth: number, x: number, y: number, z: number) => {
    const wall = BABYLON.MeshBuilder.CreateBox(name, { width, height, depth }, scene);
    wall.position = new BABYLON.Vector3(x, y, z);
    wall.material = wallMat;
    wall.checkCollisions = true;
  };

  createWall("wall1", 10, 3, 0.5, 0, 1.5, 5);
  createWall("wall2", 0.5, 3, 8, 5, 1.5, 1);
  createWall("wall3", 6, 3, 0.5, -7, 1.5, -3);
  createWall("wall4", 0.5, 3, 12, -10, 1.5, 2);
}
