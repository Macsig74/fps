let health = 100;
let ammo = 30;
const maxAmmo = 30;
let autoMode = false;

let healthBar: HTMLElement;
let healthText: HTMLElement;
let ammoCount: HTMLElement;
let fireMode: HTMLElement;

function updateHUD() {
  if (!healthBar || !healthText || !ammoCount || !fireMode) {
    return;
  }

  healthBar.style.width = `${health}%`;
  healthText.textContent = `${health} HP`;
  ammoCount.textContent = String(ammo);
}

export function useAmmo(): boolean {
  if (ammo > 0) {
    ammo--;
    updateHUD();
    return true;
  }

  return false;
}

export function reload() {
  ammo = maxAmmo;
  updateHUD();
}

export function takeDamage(amount: number) {
  health = Math.max(0, health - amount);
  updateHUD();
}

export function isAutoMode(): boolean {
  return autoMode;
}

export function setupHUD() {
  healthBar = document.getElementById("health-bar") as HTMLElement;
  healthText = document.getElementById("health-text") as HTMLElement;
  ammoCount = document.getElementById("ammo-count") as HTMLElement;
  fireMode = document.getElementById("fire-mode") as HTMLElement;

  if (!healthBar || !healthText || !ammoCount || !fireMode) {
    console.error(
      "HUD introuvable : vérifie les IDs health-bar, health-text, ammo-count et fire-mode dans ton HTML.",
    );
    return;
  }

  updateHUD();

  fireMode.textContent = "[M] SEMI";

  window.addEventListener("keydown", (e) => {
    if (e.key === "m" || e.key === "M") {
      autoMode = !autoMode;
      fireMode.textContent = autoMode ? "[M] AUTO" : "[M] SEMI";
    }

    if (e.key === "r" || e.key === "R") {
      reload();
    }
  });
}
