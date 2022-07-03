import { presets } from "./presets.js";
import { SingletonFactory } from "./singleton.js";


const singleton = SingletonFactory.getInstance();


/** @type {HTMLInputElement} */
export const slider = document.querySelector("#slider");
slider.addEventListener("input", e =>{
    singleton.t = e.target.valueAsNumber;
});


/** @type {HTMLInputElement} */
const timeMin = document.querySelector("#timeMin");

/** @type {HTMLInputElement} */
const timeMax = document.querySelector("#timeMax");

/** @type {HTMLInputElement} */
const step = document.querySelector("#step");
step.addEventListener("input", e =>{
    singleton.step = step.valueAsNumber;
});



document.querySelector("#btnPlay").addEventListener("click", (e) =>{
    singleton.iterate = !singleton.iterate;
    e.target.style.backgroundColor = singleton.iterate ? "red" : "green";
    e.target.innerHTML = singleton.iterate ? "⏸︎" : "⏵︎";
});

document.querySelector("#btnMode").addEventListener("click", (e) =>{
    singleton.mode = singleton.mode == "normal" ? "prediction" : "normal";
    e.target.innerHTML = singleton.mode;
});


/** @type {HTMLInputElement} */
const setLength = document.querySelector("#setLength");
setLength.addEventListener("input", e =>{
    singleton.setLength = parseInt(e.target.valueAsNumber);
});
singleton.setLength = setLength.valueAsNumber;


/** @type {HTMLInputElement} */
const setNum = document.querySelector("#setNum");
setNum.addEventListener("input", e =>{
    singleton.setNum = parseInt(e.target.valueAsNumber);
    singleton.updateSetsLength();
});
singleton.setNum = parseInt(setNum.valueAsNumber);


/** @type {HTMLInputElement} */
const respawn = document.querySelector("#respawn"); 
respawn.addEventListener("input", () =>{
    singleton.respawn = respawn.checked;
});
singleton.respawn = respawn.checked;


var presetCurrent = 2;
setPreset();


document.querySelector("#nextPreset").addEventListener("click", () => {
  presets.length > presetCurrent ? (presetCurrent += 1) : {};
  setPreset();
});
document.querySelector("#previousPreset").addEventListener("click", () => {
  presetCurrent > 1 ? (presetCurrent -= 1) : {};
  setPreset();
});

document.querySelectorAll("input").forEach((e) => {
  e.addEventListener("change", () => update());
});

document.querySelectorAll(".variable").forEach((e) => {
  e.addEventListener("input", (e)  => onEdit(e.target));
  e.addEventListener("blur", (e)   =>setEquationFromString());
});


function onEdit(input){
  input.style.color = "#ffd000"
  input.style.height = "auto";
  input.style.height = input.scrollHeight + "px";
}


timeMin.oninput = () => {
  slider.min = timeMin.valueAsNumber;
};
timeMax.oninput = () => {
  slider.max = timeMax.valueAsNumber;
};
step.oninput = () => {
  slider.step = Math.pow(2, step.valueAsNumber) / 100000000;
};




function setEquationFromString() {
  singleton.equation = {};
  document.querySelectorAll(".variable").forEach(input =>{
    const varName = input.dataset.var;
    onEdit(input);
    input.style.outlineStyle = "solid";
    if (["undefined", undefined, "", null].includes(input.value)) {
      input.value = "";
      input.parentElement.querySelector("div").style.color = "gray";
    } else input.parentElement.querySelector("div").style.color = null;
     const eq= new Function("x,y,z,t,i", "return " + input.value );
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
  document.querySelectorAll('.variable').forEach(e => e .value = preset[e.dataset.var]);
  timeMin.valueAsNumber = Math.floor(preset.t);
  timeMax.valueAsNumber = preset.max;
  slider.min = timeMin.valueAsNumber;
  slider.max = preset.max;
  slider.valueAsNumber = preset.t;
  step.valueAsNumber = preset.step;
  slider.step = Math.pow(2, step.valueAsNumber) / 100000000;
  setEquationFromString();
  step.disabled = false;
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




