
import { GL } from "./webgl.js";

import { SingletonFactory } from "./singleton.js";

import { slider } from "./io.js";


const step = document.querySelector("#step");
const singleton = SingletonFactory.getInstance();
const gl = new GL(document.querySelector("#canvas"));



var previousTime = 0;


//  UPDATE LOOP
function update() {

  var v = slider.valueAsNumber;
  var stp = Math.pow(2, step.valueAsNumber) / 100000000;

  const currentTime = new Date();
  const time = currentTime.getMilliseconds() + currentTime.getSeconds() * 1000;
  
  if (time < previousTime) previousTime -= 600000;

  singleton.sets.forEach(s =>{
    s.update(time);
  });

  requestAnimationFrame((time) => {
    //if(!singleton.iterate) time = null;
    gl.drawScene();
  });
    

    if (!step.disabled && stp > 0.00000001) {
      v += stp;
    }
    if (v < vMax.valueAsNumber - stp && previousTime != time) {
    } 

    else if (v > vMax.valueAsNumber && !step.valueAsNumber == 0) {
      v = vMin.valueAsNumber;
    }

  slider.valueAsNumber = v;
  singleton.v = v;

  vVal.value = slider.valueAsNumber
}






window.addEventListener("load", function init(e) {
  window.removeEventListener("load", init);

  singleton.updateSetsLength();

  var interval = setInterval(() => {
    if (!step.disabled) update();
  }, 10);
});
