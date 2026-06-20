export function createArena(scene: BABYLON.Scene) {
  // Skybox (inchangée)
  const skybox = BABYLON.MeshBuilder.CreateBox(
    "skybox",
    { size: 100.0 },
    scene,
  );

  const skyboxMaterial = new BABYLON.StandardMaterial("skyboxMat", scene);

  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.disableLighting = true;

  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "assets/skybox/skybox",
    scene,
  );

  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;

  skybox.material = skyboxMaterial;
  skybox.infiniteDistance = true;

  // Environnement
  scene.environmentTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "https://playground.babylonjs.com/textures/environment.env",
    scene,
  );

  // Lumières
  const hemiLight = new BABYLON.HemisphericLight(
    "hemiLight",
    new BABYLON.Vector3(0, 1, 0),
    scene,
  );

  hemiLight.intensity = 0.8;

  const dirLight = new BABYLON.DirectionalLight(
    "dirLight",
    new BABYLON.Vector3(-1, -2, -1),
    scene,
  );

  dirLight.position = new BABYLON.Vector3(20, 30, 20);

  dirLight.intensity = 1.2;

  // Sol
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    {
      width: 50,
      height: 50,
    },
    scene,
  );

  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);

  const grassTexture = new BABYLON.Texture(
    "https://playground.babylonjs.com/textures/grass.jpg",
    scene,
  );

  grassTexture.uScale = 12;
  grassTexture.vScale = 12;

  groundMat.diffuseTexture = grassTexture;

  groundMat.bumpTexture = new BABYLON.Texture(
    "https://playground.babylonjs.com/textures/grassn.png",
    scene,
  );

  ground.material = groundMat;
  ground.checkCollisions = true;

  // Matériau des murs
  const wallMat = new BABYLON.StandardMaterial("wallMat", scene);

  const rockTexture = new BABYLON.Texture(
    "https://playground.babylonjs.com/textures/rock.png",
    scene,
  );

  rockTexture.uScale = 3;
  rockTexture.vScale = 2;

  wallMat.diffuseTexture = rockTexture;

  wallMat.bumpTexture = new BABYLON.Texture(
    "https://playground.babylonjs.com/textures/rockn.png",
    scene,
  );

  // Création des murs
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
      {
        width,
        height,
        depth,
      },
      scene,
    );

    wall.position = new BABYLON.Vector3(x, y, z);

    wall.material = wallMat;
    wall.checkCollisions = true;

    return wall;
  };

  // Murs principaux
  createWall("wall1", 10, 3, 0.5, 0, 1.5, 5);
  createWall("wall2", 0.5, 3, 8, 5, 1.5, 1);
  createWall("wall3", 6, 3, 0.5, -7, 1.5, -3);
  createWall("wall4", 0.5, 3, 12, -10, 1.5, 2);

  // Bordures de l'arène
  createWall("north", 50, 4, 1, 0, 2, 25);
  createWall("south", 50, 4, 1, 0, 2, -25);
  createWall("east", 1, 4, 50, 25, 2, 0);
  createWall("west", 1, 4, 50, -25, 2, 0);

  // Matériau des caisses
  const crateMat = new BABYLON.StandardMaterial("crateMat", scene);

  crateMat.diffuseTexture = new BABYLON.Texture(
    "https://playground.babylonjs.com/textures/crate.png",
    scene,
  );

  const createCrate = (x: number, y: number, z: number) => {
    const crate = BABYLON.MeshBuilder.CreateBox("crate", { size: 2 }, scene);

    crate.position = new BABYLON.Vector3(x, y, z);

    crate.material = crateMat;
    crate.checkCollisions = true;

    return crate;
  };

  // Obstacles
  createCrate(8, 1, 8);
  createCrate(-8, 1, 8);
  createCrate(8, 1, -8);
  createCrate(-8, 1, -8);
  createCrate(0, 1, 12);
  createCrate(0, 1, -12);

  // Colonnes
  for (let i = 0; i < 4; i++) {
    const pillar = BABYLON.MeshBuilder.CreateCylinder(
      `pillar${i}`,
      {
        height: 4,
        diameter: 2,
      },
      scene,
    );

    pillar.position = new BABYLON.Vector3(-12 + i * 8, 2, 0);

    pillar.material = wallMat;
    pillar.checkCollisions = true;
  }
}
