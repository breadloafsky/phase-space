import { presets } from "./presets.js";
import { PointSet } from "./set.js";


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
    vectors = [];
    equation = null;
    camera = null;
    iterate = true;
    setLength = 4;
    mode = "normal";
    respawn = false;
    presetCurrent = 2;
    setNum = 2;
    step = 0;
    t = 0.5;
    
    

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





