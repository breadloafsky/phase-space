import { presets } from "./presets.js";
import { SingletonFactory } from "./singleton.js";


const singleton = SingletonFactory.getInstance();

var presetCurrent = 1;




/** @type {HTMLInputElement} */
export const slider = document.querySelector("#slider");
slider.addEventListener("input", e =>{
    singleton.v = e.target.valueAsNumber;
});


/** @type {HTMLInputElement} */
const vMin = document.querySelector("#vMin");

/** @type {HTMLInputElement} */
const vMax = document.querySelector("#vMax");

/** @type {HTMLInputElement} */
const step = document.querySelector("#step");
step.addEventListener("input", e =>{
    singleton.step = step.valueAsNumber;
});






/** @type {HTMLInputElement} */
const setLength = document.querySelector("#setLength");
setLength.addEventListener("input", e =>{
    singleton.setLength = parseInt(e.target.valueAsNumber);
});
function setSetLength(v)
{
  setLength.valueAsNumber = v;
  singleton.setLength = v;
}


/** @type {HTMLInputElement} */
const setNum = document.querySelector("#setNum");
setNum.addEventListener("input", e =>{
    singleton.setNum = parseInt(e.target.valueAsNumber);
    singleton.updateSetsLength();
});
function setSetNum(v)
{
  setNum.valueAsNumber = v;
  singleton.setNum = v;
}




/** @type {HTMLInputElement} */
const pointSize = document.querySelector("#pointSize")
pointSize.addEventListener("input", (e) =>{
    singleton.pointSize = e.target.valueAsNumber;
});
function setPointSize(v)
{
    pointSize.valueAsNumber = v;
    singleton.pointSize = v;
}




/** @type {HTMLInputElement} */
const sizeRatio = document.querySelector("#sizeRatio"); 
sizeRatio.addEventListener("input", () =>{
    singleton.sizeRatio = sizeRatio.checked;
});
function setSizeRatio(v)
{
    sizeRatio.checked = v;
    singleton.sizeRatio = v;
}


/** @type {HTMLInputElement} */
const respawn = document.querySelector("#respawn"); 
respawn.addEventListener("input", () =>{
    singleton.respawn = respawn.checked;
});
function setRespawn(v)
{
    respawn.checked = v;
    singleton.respawn = v;
}


/** @type {HTMLInputElement} */
const respawnRate = document.querySelector("#respawnRate")
respawnRate.addEventListener("input", (e) =>{
    singleton.respawnRate = e.target.valueAsNumber;
});
function setRespawnRate(v)
{
    respawnRate.valueAsNumber = v;
    singleton.respawnRate = v;
}


/** @type {HTMLInputElement} */
const startX = document.querySelector("#sx")
startX.addEventListener("input", (e) =>{
    singleton.startX = e.target.valueAsNumber;
});
/** @type {HTMLInputElement} */
const startY = document.querySelector("#sy")
startY.addEventListener("input", (e) =>{
    singleton.startY = e.target.valueAsNumber;
});
/** @type {HTMLInputElement} */
const startZ = document.querySelector("#sz")
startZ.addEventListener("input", (e) =>{
    singleton.startZ = e.target.valueAsNumber;
});

function setStart([x,y,z])
{
  startX.valueAsNumber = x;
  startY.valueAsNumber = y;
  startZ.valueAsNumber = z;
}

/** @type {HTMLInputElement} */
const startRnd = document.querySelector("#srnd")
startRnd.addEventListener("input", (e) =>{
    singleton.startRnd = e.target.valueAsNumber;
});
function setStartRnd(v)
{
  startRnd.valueAsNumber = v;
  singleton.startRnd = v;
}


document.querySelector("#btnIterate").addEventListener("click", (e) =>{
  singleton.iterate = !singleton.iterate;
  e.target.style.backgroundColor = singleton.iterate ? "red" : "green";
  e.target.innerHTML = singleton.iterate ? "⏸︎" : "⏵︎";
});


/** @type {HTMLInputElement} */
const iterationStep = document.querySelector("#iterStep")
iterationStep.addEventListener("input", (e) =>{
    singleton.iterationStep = e.target.valueAsNumber;
});
function setIterationStep(v)
{
  iterationStep.valueAsNumber = v;
  singleton.iterationStep = v;
}




document.querySelector("#nextPreset").addEventListener("click", () => {
  if(presets.length > presetCurrent) 
  {
    presetCurrent++; 
    setPreset();
  }
  
});
document.querySelector("#previousPreset").addEventListener("click", () => {
  if(presetCurrent > 1) 
  {
    presetCurrent--;
    setPreset();
  }
});

document.querySelectorAll("input").forEach((e) => {
  e.addEventListener("change", () => update());
});

document.querySelectorAll(".variable").forEach((e) => {
  e.addEventListener("input", (e)  => {e.inputType == "insertText" && onEdit(e.target)});
  e.addEventListener("blur", (e)   => setEquationFromString());
});


function onEdit(input){
 
    input.style.color = "#ffd000"
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
  
  
}


vMin.oninput = () => {
  slider.min = vMin.valueAsNumber;
};
vMax.oninput = () => {
  slider.max = vMax.valueAsNumber;
};
step.oninput = () => {
  slider.step = Math.pow(2, step.valueAsNumber) / 100000000;
};

const vVal = document.querySelector("#vVal");


function setEquationFromString() {
  singleton.equation = {};
  document.querySelectorAll(".variable").forEach(input =>{
    const varName = input.dataset.var;
    //onEdit(input);
    input.style.outlineStyle = "solid";
    if (["undefined", undefined, "", null].includes(input.value)) {
      input.value = "";
      input.parentElement.querySelector("div").style.color = "gray";
    } else input.parentElement.querySelector("div").style.color = null;
     const eq= new Function("x,y,z,v", "return " + input.value );
    try {
      if(typeof eq === 'function')
      {
        if(eq(1, 1, 1, 1));
        {
          singleton.equation[varName] = eq;
          input.style.outlineStyle = null;
          input.style.color = null;
        }
        
      }
      
    } catch (e) {

    }
  });
  update();
}


function setPreset() {
  const preset = presets[presetCurrent - 1];
  document.querySelector("#preset").innerHTML =
    presetCurrent + "/" + presets.length;
  document.querySelector("#presetName").innerHTML = preset.name;
  document.querySelectorAll('.variable').forEach(e => e .value = preset[e.dataset.var]);
  

  vMin.valueAsNumber = Math.floor(preset.v);
  vMax.valueAsNumber = preset.max;
  slider.min = vMin.valueAsNumber;
  slider.max = preset.max;

  slider.valueAsNumber = preset.v;
  step.valueAsNumber = preset.step;

  slider.step = Math.pow(2, step.valueAsNumber) / 100000000;
  

  setStart(preset.pointStart);

  singleton.camera.position = preset.camPos;
  singleton.camera.pitch = preset.camPitch;
  singleton.camera.yaw = preset.camYaw;
  singleton.camera.updateVectors();

  setSetLength(preset.setLength);
  setSetNum(preset.setNum);
  setIterationStep(1);
  setStartRnd(preset.startRandomness);
  if(preset.respawnRate)
  {
    setRespawn(true)
    setRespawnRate(preset.respawnRate);
  }
  else{
    setRespawn(false)
    setRespawnRate(100);
  }
  setPointSize(preset.pointSize);
  setSizeRatio(preset.sizeRatio);


  singleton.sets = [];
  singleton.updateSetsLength();
  setEquationFromString();

  singleton.d = 0;
}

function update(){
}


//  Make cursor disappear
var mouseTimer = 0;
canvas.addEventListener("mousemove", () => {
  canvas.style.cursor = "crosshair";
  clearTimeout(mouseTimer);
  mouseTimer = setTimeout(() => (canvas.style.cursor = "none"), 1000);
});









var mouseDown;
canvas.addEventListener("mousedown", (e) => {
    mouseDown = e.button;
  });
  canvas.addEventListener("mouseup", () => {
    mouseDown = null;
  });

  

  canvas.addEventListener("mousemove", (e) => {
    if (mouseDown == 0) {
        singleton.camera.yaw += e.movementX / 100;
        singleton.camera.addPitch(-e.movementY / 100);
    }
  });
  canvas.onwheel = (e) => {
    singleton.camera.position = vec3.add(
      [],
      singleton.camera.position,
      singleton.camera.front.map((p) => (p * -Math.sign(e.deltaY)) / 4)
    );
  };

  document.addEventListener("keydown", (e) => {
    if (e.code == "KeyW") singleton.camera.movement[0] = 1;
    else if (e.code == "KeyS") singleton.camera.movement[0] = -1;
    else if (e.code == "KeyA") singleton.camera.movement[1] = -1;
    else if (e.code == "KeyD") singleton.camera.movement[1] = 1;
  });
  document.addEventListener("keyup", (e) => {
    if (["KeyW", "KeyS"].includes(e.code)) singleton.camera.movement[0] = 0;
    else if (["KeyA", "KeyD"].includes(e.code)) singleton.camera.movement[1] = 0;
  });


 
  window.addEventListener("load", function init(e) {
    window.removeEventListener("load", init);
    setPreset();
 

  });