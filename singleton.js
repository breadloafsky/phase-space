import { presets } from "./presets.js";
import { PointSet } from "./set.js";

import { Camera } from "./camera.js";
export const SingletonFactory = (function(){

    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new Singleton();
                delete instance.constructor;
            }
            return instance;
        }
   };
})();


class Singleton
{
    sets = [];
    equation = null;
    camera = new Camera([0, 0, 1]);;
    iterate = true;
    iterationStep = 1;
    setNum = 2;
    setLength = 4;
    respawn = false;
    respawnRate = 100;
    presetCurrent = 2;
    step = 0;
    startX = 0.;
    startY = 0.;
    startZ = 0.;
    startRnd = 100.;
    sizeRatio = true;

 

    pointSize = 0.1;
    showVectors = false;

    v = 0.5;
    
    

    constructor() {

    }
    
}







Singleton.prototype.updateSetsLength = function()
{
    const s = this.setNum - this.sets.length;

    if(s > 0)
    {
        for (let i = 0; i <Math.abs(s); i++)
        {
            this.sets.push(new PointSet());
        }
    }
    else if(s < 0)
    for (let i = 0; i <Math.abs(s); i++)
    {
        this.sets.pop();
    }
}


Singleton.prototype.setPreset = function() {
    const preset = presets[this.presetCurrent - 1];
    document.querySelector("#preset").innerHTML =
      this.presetCurrent + "/" + presets.length;
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





