


export const presets = [
  {
    x: `x + (x*0.13+y*z)*0.001`,
    y: `y + (x*0.01-0.4*y-z*x)*0.001`,
    z: `z + (-z-x*y)*0.001`,
    t: -0.66,
    step: 14.5,
    max: 1,
    scale: 0.01,
  },
  {
    x: `x + (10*(y-x))*0.01`,
    y: `y + (x*(28-z)-y)*0.01`,
    z: `z + (x*y-(8/3)*z)*0.01`,
    t: -0,
    step: 0,
    max: 0,
    scale: 0.01,
  },
  {
    x: `x + (10*(y-x))*0.005`,
    y: `y + (x*(28-z)-y+t/z)*0.005-Math.sin(t*4+z/10)`,
    z: `z + (x*y-(8/3)*z)*0.005`,
    t: -0,
    step: 18.5,
    max: 10,
    scale: 0.01,
  },
  

  {
    x: `x + (x*0.13+y*1)*0.001`,
    y: `y + (z-333*x/(y*z))*0.001`,
    z: `z + (y-z*333)*0.001`,
    t: -0.66,
    step: 14.5,
    max: 1,
    scale: 0.01,
  },
  
  {
    x: `x + (x-z*0.001*y)*0.001`,
    y: `y + (Math.cos(100*z/x)*400)*0.001`,
    z: `z + (x/z*500*Math.sin(y*44))*0.001`,
    t: 0,
    step: 14.5,
    max: 0,
    scale: 0.01,
  },
  {
    x: `x + (Math.sin(y*z*1.1/x)*400)*0.001`,
    y: `y + (Math.cos(z*x*1.1/y)*400)*0.001`,
    z: `z + (Math.cos(x*y*1.1/z)*400)*0.001`,
    t: 0,
    step: 14.5,
    max: 0,
    scale: 0.01,
  },
  {
    x: `x + (Math.sin(y*z/x*t)*100)*0.001`,
    y: `y + (Math.cos(z*x/y*0.2)*100)*0.001`,
    z: `z + (Math.cos(y*y/z*0.2)*100)*0.001`,
    t: 0,
    step: 14.5,
    max: 0,
    scale: 0.01,
  },
];
