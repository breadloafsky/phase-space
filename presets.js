


export const presets = [
  
  {
    name:"Lorenz",
    x: `(10*(y-x))*0.01`,
    y: `(x*(28-z)-y)*0.01`,
    z: `(x*y-(8/3)*z)*0.01`,
    v: -0,
    step: 0,
    max: 0,
    pSize: 0.01,
  },
  {
    name:"Rössler",
    x: `-(y+z)*0.05`,
    y: `(x+0.2*y)*0.05`,
    z: `(0.2+z*(x-5.7))*0.05`,
    v: -0,
    step: 0,
    max: 0,
    pSize: 0.01,
  },
  {
    name:"Rabinovich–Fabrikant",
    x: `(y*(z-1+x*x)*0.1*x)*0.01`,
    y: `(x*(3*z+1-x*x)*0.1*y)*0.01`,
    z: `(-2*z*(0.05+x*y))*0.01`,
    v: -0,
    step: 18.5,
    max: 10,
    pSize: 0.01,
  },
  

  
  
  {
    name:"Clouds",
    x: `(x-z*0.001*y)*0.002`,
    y: `(Math.cos(100*z/x)*400)*0.002`,
    z: `(x/z*500*Math.sin(y*44))*0.002`,
    v: 0,
    step: 14.5,
    max: 0,
    pSize: 0.02,
  },
  {
    x: `(x*0.13+y*z)*0.001`,
    y: `(x*0.01-0.4*y-z*x)*0.001`,
    z: `(-z-x*y)*0.001`,
    v: -0.66,
    step: 14.5,
    max: 1,
    pSize: 0.01,
  },
  {
    x: `(Math.sin(y*z/x*v)*100)*0.001`,
    y: `(Math.cos(z*x/y*0.2)*100)*0.001`,
    z: `(Math.cos(y*y/z*0.2)*100)*0.001`,
    v: 0,
    step: 14.5,
    max: 0,
    pSize: 0.01,
  },
];
