![alt text](https://github.com/breadloafsky/phase-space/blob/master/res/1.PNG?raw=true)
# Phase Space
This interactive application draws 3-dimensional phase portraits defined by systems of ordinary differential equations.

## Demo
https://phase-space.netlify.app
(epilepsy warning)

the application can crash your browser when the number of points is too big


## About
The phase portraits consist of sets of points that can have from one to many points that share the same initial condition, but having different state of numerical integration. The initial conditions of sets can be shifted by activating the integration of sets. The method used for the integration is RK4 Runge-Kutta.

## Usage



The sets of points are defined on the right side.

Each set has its length (number of points in the set), size of the point, and the spawn point ( the initial state of the set ).

Each point has variables (***x***, ***y***, ***z***) that represent its position of the point in the 3D space.
Each of the variables has its corresponding differential equation:

![equations](http://latex.codecogs.com/gif.latex?f%27%28x%29%2C%20%0Af%27%28y%29%2C%0Af%27%28z%29)

The equations can be edited on the left sidebar, using JavaScript-like syntax.


***Integration Step*** is a numerical step of integration, very large values can reduce the accuracy or break prediction.\
The global variable ***v*** can be used to add change with time.\
The controls for ***v*** are on the bottom bar.



#### Controls

Hold LMB to rotate the camera.\
RMB to move the view target.\
Mouse wheel - Zoom.
