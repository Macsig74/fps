export function setupUI(canvas: HTMLCanvasElement, camera: BABYLON.UniversalCamera) {
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

  pauseDiv.addEventListener("click", () => {
    canvas.requestPointerLock();
    pauseDiv.style.display = "none";
  });
}
