import { presets } from "./presets.js";

import { GL } from "./webgl.js";

import { PointSet } from "./set.js";

import { FieldVector } from "./fieldVision.js";

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#canvas");

/** @type {HTMLInputElement} */
const slider = document.querySelector("#slider");

/** @type {HTMLInputElement} */
const timeMin = document.querySelector("#timeMin");

/** @type {HTMLInputElement} */
const timeMax = document.querySelector("#timeMax");

/** @type {HTMLInputElement} */
const step = document.querySelector("#step");

/** @type {HTMLInputElement} */
/* const respawn = document.querySelector("#respawn");  */




/** @type {HTMLInputElement} */
const setLength = document.querySelector("#length");



const setNum = document.querySelector("#setNum"); 


document.querySelector("#btnPlay").addEventListener("click", (e) =>{
  iterate = !iterate;
  e.target.style.backgroundColor = iterate ? "red" : "green";
  e.target.innerHTML = iterate ? "⏸︎" : "⏵︎";
});


document.querySelector("#btnMode").addEventListener("click", (e) =>{
  mode = mode == "normal" ? "prediction" : "normal";
  e.target.innerHTML = mode;
});



setNum.addEventListener("input", () =>{
  updateSets();
});

var mode = "normal";

var iterate = true;
var equation = null;
var pointNum = 20;
var presetCurrent = 2;
const gl = new GL(canvas);
const sets = [];
const vectors = [];
setPreset();


function updateSets(){

  var s = setNum.valueAsNumber - sets.length;

  if(s > 0)
  {
    for (let i = 0; i <Math.abs(s); i++)
    {
      new PointSet(sets);
    }
  }
  else if(s < 0)
  for (let i = 0; i <Math.abs(s); i++)
    {
      sets.pop();
    }
    
}




document.querySelectorAll(".pin").forEach((e) => {
  e.addEventListener("click", () => {
    const parent = e.parentElement.parentElement;
    parent.dataset.pinned = parent.dataset.pinned == "false" ? "true" : "false";
  });
});

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
  equation = {};
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
          console.log(eq(1, 1, 1, 1, 1) != NaN);
          equation[varName] = eq;
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

canvas.addEventListener("click", (e) => {
  update();
});

var previousTime = 0;



                        //  UPDATE LOOP
function update() {
  var t = slider.valueAsNumber;
  var stp = Math.pow(2, step.valueAsNumber) / 100000000;

  const d = new Date();
  const time = d.getMilliseconds() + d.getSeconds() * 1000;
  if (time < previousTime) previousTime -= 60000;
 


    requestAnimationFrame((time) => {

      let _setLength = parseInt(setLength.valueAsNumber);
      if(!iterate) time = null;

      sets.forEach(s =>{
        s.update(mode,time,_setLength,equation, t);
      })
      vectors.forEach(s =>{
        s.update(equation, t);
      })

   
      

    gl.drawScene(sets, vectors);

    });
    if (t < timeMax.valueAsNumber - stp && previousTime != time) {
    } else if (timeMin.valueAsNumber < timeMax.valueAsNumber) {
      slider.valueAsNumber = timeMin.valueAsNumber;
    }

  if (!step.disabled && stp > 0.00000001) {
    slider.valueAsNumber += stp;
  }

  
  document.querySelector("#tVal").value = slider.valueAsNumber;
}


//  Make cursor disappear
var mouseTimer = 0;
canvas.addEventListener("mousemove", () => {
  canvas.style.cursor = "crosshair";
  clearTimeout(mouseTimer);
  mouseTimer = setTimeout(() => (canvas.style.cursor = "none"), 1000);
});




window.addEventListener("load", function init(e) {
  window.removeEventListener("load", init);

  updateSets();

  for(let i = 0; i < 600; i++)
      {
        const w =100;
        new FieldVector(vectors,w-Math.random()*w*2,w-Math.random()*w*2,w-Math.random()*w*2);
      }
  
  setPreset();
  var interval = setInterval(() => {
    if (!step.disabled) update();
  }, 10);
});
