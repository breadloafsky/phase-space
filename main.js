
import { GL } from "./webgl.js";

import { SingletonFactory } from "./singleton.js";

import { slider } from "./io.js";


const step = document.querySelector("#step");
const singleton = SingletonFactory.getInstance();
const gl = new GL(canvas = document.querySelector("#canvas"));



var previousTime = 0;


//  UPDATE LOOP
function update() {

  var v = slider.valueAsNumber;
  var stp = Math.pow(2, step.valueAsNumber) / 100000000;

  const currentTime = new Date();
  const time = currentTime.getMilliseconds() + currentTime.getSeconds() * 1000;

  if (time < previousTime) previousTime -= 60000;
    requestAnimationFrame((time) => {
      if(!singleton.iterate) time = null;

      singleton.sets.forEach(s =>{
        s.update(time);
      })
      singleton.vectors.forEach(s =>{
        s.update();
      })
      
    gl.drawScene();
    
    });
    if (v < vMax.valueAsNumber - stp && previousTime != time) {
    } else if (vMin.valueAsNumber < vMax.valueAsNumber) {
      v = vMin.valueAsNumber;
    }

  if (!step.disabled && stp > 0.00000001) {
    v += stp;
  }


  slider.valueAsNumber = v;
  singleton.v = v;

  document.querySelector("#vVal").value = slider.valueAsNumber;
}






window.addEventListener("load", function init(e) {
  window.removeEventListener("load", init);

  singleton.updateSetsLength();

    /* for(let i = 0; i < 600; i++)
      {
        const w =100;
        new FieldVector(vectors,w-Math.random()*w*2,w-Math.random()*w*2,w-Math.random()*w*2);
    } */
  
  var interval = setInterval(() => {
    if (!step.disabled) update();
  }, 10);
});
