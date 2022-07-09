
import { GL } from "./webgl.js";

import "./io.js";
import { SingletonFactory } from "./singleton.js";









const singleton = SingletonFactory.getInstance();
const gl = new GL(document.querySelector("#canvas"));



var previousTime = 0;


//  UPDATE LOOP
function update() {

  var v = slider.valueAsNumber;
  var stp = Math.pow(2, step.valueAsNumber) / 100000000;



  singleton.sets.forEach(s =>{
    s.update();
  });

  requestAnimationFrame((time) => {
    if(previousTime+16 < time)
    {
      gl.drawScene();
      previousTime = time;
    }
    
  });
    

    if (!step.disabled && stp > 0.00000001) {
      v += stp;
    }
  
    
    if (v > vMax.valueAsNumber && step.valueAsNumber != 0) {
      
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
