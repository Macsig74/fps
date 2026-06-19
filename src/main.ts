import { createArena } from "./arena.js";
import { createPlayer } from "./player.js";
import { loadWeapon, setupShooting } from "./weapon.js";
import { setupUI } from "./ui.js";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
scene.collisionsEnabled = true;

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.8;

const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-1, -2, 1), scene);
dirLight.intensity = 0.5;

const camera = createPlayer(scene, canvas);
createArena(scene);
loadWeapon(scene, camera);
setupShooting(scene, engine, camera);
setupUI(canvas, camera);

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
