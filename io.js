import { presets } from "./presets.js";
import { SingletonFactory } from "./singleton.js";
import { parse } from "./utils.js";

const singleton = SingletonFactory.getInstance();

var presetCurrent = 1;




/** @type {HTMLInputElement} */
export const slider = document.querySelector("#slider");  // defines the value of 'v'
slider.addEventListener("input", e =>{
    singleton.v = e.target.valueAsNumber;
});
function setV(s){
  singleton.v = s;
  slider.valueAsNumber = s;
}



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
const coordPlane = document.querySelector("#coordPlane"); 
coordPlane.addEventListener("input", () =>{
    singleton.coordPlane = coordPlane.checked;
});
function setCoordPlane(v)
{
    coordPlane.checked = v;
    singleton.coordPlane = v;
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



const startPoints = document.querySelectorAll(".start-position");
const startRandomness = document.querySelectorAll(".start-randomness");


startPoints.forEach((s,i)=>{
  s.addEventListener("input", (e) =>{
    singleton.startPoints[i] = e.target.valueAsNumber;
  });
});

startRandomness.forEach((s,i)=>{
  s.addEventListener("input", (e) =>{
    singleton.startRnd[i] = e.target.valueAsNumber;
  });
});

function setStart(s)
{
  startPoints.forEach((p,i) => p.valueAsNumber=s[i]);
  singleton.startPoints.forEach((p,i) => singleton.startPoints[i]=s[i]);
}
function setStartRnd(s)
{
  startRandomness.forEach((p,i) => p.valueAsNumber=s[i]);
  singleton.startRnd.forEach((p,i) => singleton.startRnd[i]=s[i]);
}
 



/** @type {HTMLInputElement} */
const btnIterate = document.querySelector("#btnIterate");
btnIterate.addEventListener("click", (e) =>{
  singleton.iterate = !singleton.iterate;
  e.target.style.backgroundColor = singleton.iterate ? "red" : "green";
  e.target.innerHTML = singleton.iterate ? "pause" : "start";
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

const dimensions = document.querySelectorAll(".dimension");
dimensions.forEach((e,i) => {
  e.addEventListener("input", (l) =>{
    setDimension(i, l.target.value);
  });
});

//  ToDo
function setDimension(i,l)
{
  singleton.dimensions.forEach((d,j) =>{
    if (singleton.dimensions[j] == dimensions[i].value && d==l)
      singleton.dimensions[j] = singleton.dimensions[i];
      
  });
  singleton.dimensions[i] = l;
  dimensions.forEach((d,j) =>{
    const val = singleton.dimensions[j];
    d.value = val;
    d.style.color = val == "x"? "red":val=="y"?"green":val=="z"?"blue":"black";
  });

}

document.querySelector("#closeInfo").addEventListener("click", (e) => {e.target.parentNode.remove();});

document.querySelectorAll(".pin").forEach((e) => {
  e.addEventListener("click", () => {
      const parent = e.parentElement.parentElement;
      parent.dataset.pinned = parent.dataset.pinned == "false" ? "true" : "false";
  });
});


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

const equationEditor =  document.querySelectorAll(".variable");

equationEditor.forEach((e) => {
  e.style.height = e.scrollHeight + "px";
  e.addEventListener("input", (e)  => {e.inputType.length > 0 && onEdit(e.target);});
  e.addEventListener("blur", (e)   => setEquationFromString());
});


function onEdit(input){
    input.style.color = "#ffd000"
    resizeEquations();
}

function resizeEquations(){
  equationEditor.forEach((e) => {
    e.style.height = "auto";
    e.style.height = e.scrollHeight + "px";
  });
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

    var val = input.value;
    input.style.outlineStyle = "solid";
    if (["undefined", undefined, "", null].includes(input.value)) {
      val = "0";
      input.parentElement.querySelector("div").style.color = "gray";
    } 
    else 
      input.parentElement.querySelector("div").style.color = null;

    const eq= new Function("x,y,z,a,v", "return " + parse(val) );
    
    try {
      if(typeof eq === 'function')
      {
        if(eq(1, 1, 1, 1, 1));
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
  document.querySelectorAll('.variable').forEach(e => e .value = preset[e.dataset.var] ? preset[e.dataset.var]:"");

  vMin.valueAsNumber = preset.vMin ? preset.vMin: Math.floor(preset.v);
  vMax.valueAsNumber = preset.vMax;
  slider.min = vMin.valueAsNumber;
  slider.max = preset.vMax;

  setV(preset.v);
  step.valueAsNumber = preset.step;
  slider.step = Math.pow(2, step.valueAsNumber) / 100000000;
  

  setStart(preset.pointStart);
  setStartRnd(preset.startRandomness);

  singleton.camera.position = preset.camPos;
  singleton.camera.pitch = preset.camPitch;
  singleton.camera.yaw = preset.camYaw;
  singleton.camera.updateVectors();

  setSetLength(preset.setLength);
  
  setSetNum(preset.setNum);
  setIterationStep(1);
  setPointSize(preset.pointSize);
  setSizeRatio(preset.sizeRatio);

  if(preset.respawnRate)
  {
    setRespawn(true)
    setRespawnRate(preset.respawnRate);
  }
  else{
    setRespawn(false)
    setRespawnRate(100);
  }
  


  ["x","y","z","a"].forEach((a,i) => setDimension(i,a));

  setCoordPlane(false);
  

  singleton.sets = [];
  singleton.updateSetsLength();
  setEquationFromString();
  resizeEquations();
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