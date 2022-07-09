import { SingletonFactory } from "./singleton.js";
import { extractFromFile } from "./utils.js";
const singleton = SingletonFactory.getInstance();
var screen = [100,100];







export function GL(canvas) {

  this.buffers = {};
  const attribs = {"alpha":true,"antialias":true,"depth":true,"failIfMajorPerformanceCaveat":false,"powerPreference":"default","premultipliedAlpha":true,"preserveDrawingBuffer":false,"stencil":false};
  this.gl =
    canvas.getContext("webgl",attribs) || canvas.getContext("experimental-webgl",attribs);

  const resize = () =>{
    screen = [
      canvas.parentElement.offsetWidth/1.3,
      canvas.parentElement.offsetHeight/1.3,
    ];
    canvas.setAttribute("width", screen[0]);
    canvas.setAttribute("height", screen[1]);

    this.gl.viewport( 0, 0, screen[0], screen[1] );
  }

  window.addEventListener("resize",() => resize());
  resize();

 



  if (!this.gl) {
    alert("WebGL ERROR.");
    return;
  }

  
  const pointsVS = `
    //attribute vec4 aVertexPosition;
    uniform mat4 uView;
    uniform mat4 uProjection;   
    attribute vec3 aPoint;
    attribute float aSize;
    attribute vec3 aColorVector;
     
    varying lowp vec4 vColor;
    varying lowp vec3 vPos;

    void main(void) {
      vec3 col = mix(vec3(0.,1.,0.)/1.2,vec3(0.,0.,1.)*2., aColorVector.y);
      col = mix(col,vec3(1.,0.,0.), aColorVector.x); 
      gl_Position = uProjection * uView  * vec4(aPoint, 1.);
      gl_PointSize = aSize * 1000. / gl_Position.z; 

      vPos = aPoint;
      vColor = vec4(col,0.9);
    }
  `;
  const pointsFS = `
    varying lowp vec4 vColor;
    varying lowp vec3 vPos; 
    precision lowp float;
    void main(void) {
      vec4 col = vColor;
      float r = length(gl_PointCoord-vec2(0.5));
      if(r > 0.5)
        discard;
      //col = col/(sin(r*50.)/10.+1.);
      col = col/(r+0.5);
      gl_FragColor = col;
    }
  `;




  const planeVS = `
  attribute vec4 aVertexPosition;
  uniform mat4 uView;
  uniform mat4 uProjection;   
  uniform mat4 uModel;
   
  varying lowp vec4 vColor;
  varying lowp vec4 vPos;
  
  void main(void) {
    gl_Position = uProjection * uView  * uModel * aVertexPosition;
    vec3 col = vec3(0.5,0.3,1.0);

    /* if(aVertexPosition.x+aVertexPosition.z > -1. && aVertexPosition.x+aVertexPosition.z < 1.)
      col = col/33.; */

    vPos = uModel*aVertexPosition;

    //col = mix(col,vec3(0.5,0.5,0.5), gl_Position.z/100.);

    col = col-(gl_Position.z/400.);
      
    vColor = vec4(col,0.9);


    
    
  }
`;
  const planeFS = `
    varying lowp vec4 vColor;
    varying lowp vec4 vPos; 
    precision lowp float;

    float modI(float a,float b) {
      float m=a-floor((a+0.5)/b)*b;
      return floor(m+0.5);
    }

    void main(void) {
      if(modI(abs(vPos.x*10.),100.) > 1.)
        discard;

      vec4 col = vColor;
      gl_FragColor = col;
    }

    
  `;


  //const planeShader = this.initShaderProgram( planeVS, planeFS);

  this.shaders ={
    
    point:{
      program: {},
      attrbutes: {
        aPoint: {value:null},
        aColorVector: {value:null},
        aSize: {value:null},
      },
      uniforms: {
        uProjection: {value:null},
        uView: {value:null},
      },
      vs: "res/shaders/point.vs",
      fs: "res/shaders/point.fs",
    },


    plane:{
      program: {},
      attrbutes: {
        aVertexPosition: {value:null},
      },
      uniforms: {
        uProjection: {value:null},
        uView: {value:null},
        uModel: {value:null},
      },
      vs: "res/shaders/plane.vs",
      fs: "res/shaders/plane.fs",
    }
  };

  for (let shaderName in this.shaders)
  {
    let shader = this.shaders[shaderName];
    shader.program = this.initShaderProgram( 
      extractFromFile(`res/shaders/${shaderName}.vs`), 
      extractFromFile(`res/shaders/${shaderName}.fs`)
      );
      
    for(let attributeName in shader.attrbutes){
      shader.attrbutes[attributeName].location = this.gl.getAttribLocation(shader.program, attributeName);
    }
    for(let uniformName in shader.uniforms){
      shader.uniforms[uniformName].location = this.gl.getUniformLocation(shader.program, uniformName);
    }
  }


  this.initPlaneBuffer();


  return this;
}


GL.prototype.initPlaneBuffer = function(){
  const gl = this.gl;
  var positions = [-1.0, 0.0, -1.0, 
    -1.0, 0.0, 1.0, 
    1.0, 0.0, 1.0, 
    -1.0, 0.0, -1.0, 
    1.0, 0.0, 1.0, 
    1.0, 0.0, -1.0];
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

    this.shaders.plane.attrbutes.aVertexPosition.value = positionBuffer;
}


GL.prototype.initPointsBuffers = function()  {

  const gl = this.gl;
  
  var positions = [];
  var sizeFactors = [];
  var colorVectors = [];
  const dimensions = singleton.dimensions;

  singleton.sets.forEach((s,k) => {
    
    const points = s.points.map(p=>{return {...p, x:p[dimensions[0]], y:p[dimensions[1]], z:p[dimensions[2]], a:p[dimensions[3]]}});
    const lastVector = {x:s.lastVector[dimensions[0]], y:s.lastVector[dimensions[1]], 
      z:s.lastVector[dimensions[2]], a:s.lastVector[dimensions[3]] };

    points.forEach((point, i) => {

      
      const next = i >= points.length-1 ? [lastVector.x,lastVector.y,lastVector.z] :[points[i+1].x,points[i+1].y,points[i+1].z];
      const distance = vec3.distance( [point.x, point.y, point.z], next);
      const normal = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z],next) :vec3.subtract([],next, [point.x,point.y,point.z]) 
      );

      const normalCam = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z], singleton.camera.position) :vec3.subtract([], singleton.camera.position, [point.x,point.y,point.z]) 
      );

      positions.push(point.x, point.y, point.z);
      sizeFactors.push(singleton.pointSize * (singleton.sizeRatio ? (i+1) / points.length : 1) / (singleton.respawn ? s.lifeMax()/(s.lifeMax()-s.life) : 1));
      
      colorVectors.push(distance > 0 ? Math.abs(vec3.dot(normalCam,normal))/1.2 : 0.2,
          (Math.sin((s.lifeRand*100+i*15)/points.length))/2, 1); // Get the colour of the point based on the camera position + point rotation.
      
        

    });
  });
  
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);



  const sizeFactorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeFactorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizeFactors), gl.DYNAMIC_DRAW);

  const colorVectorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorVectorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVectors), gl.DYNAMIC_DRAW);


  gl.bindBuffer(gl.ARRAY_BUFFER, null);


  this.shaders.point.attrbutes.aPoint.value = positionBuffer;
  this.shaders.point.attrbutes.aSize.value = sizeFactorBuffer;
  this.shaders.point.attrbutes.aColorVector.value = colorVectorBuffer;
  

  return positions.length/3;

}




//  draw
GL.prototype.drawScene = function ()  {



  const buffers = this.buffers;

  const gl = this.gl;
  const pointShader = this.shaders.point;
  const planeShader = this.shaders.plane;

  const camera = singleton.camera;
  camera.move();


  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const projectionMatrix = camera.getProjectionMatrix(screen[0] / screen[1]);
  const viewMatrix = camera.getViewMatrix();
 


/*   gl.vertexAttribPointer(
    programInfo.attribLocations.camPos,
    numComponents,
    type,
    normalize,
    stride,
    offset
  ); */

  gl.useProgram(pointShader.program);
  
  gl.uniformMatrix4fv(
    pointShader.uniforms.uView.location,
    false,
    viewMatrix
  );
  gl.uniformMatrix4fv(
    pointShader.uniforms.uProjection.location,
    false,
    projectionMatrix
  );
  

  const num = this.initPointsBuffers();

  const type = gl.FLOAT;

  //  Size multiplier
  gl.bindBuffer(gl.ARRAY_BUFFER, pointShader.attrbutes.aSize.value);
  gl.vertexAttribPointer(
    pointShader.attrbutes.aSize.location,
    1,type,false,0,0
  );
  gl.enableVertexAttribArray(pointShader.attrbutes.aSize.location);


  //  Colour definition
  gl.bindBuffer(gl.ARRAY_BUFFER, pointShader.attrbutes.aColorVector.value);
  gl.vertexAttribPointer(
    pointShader.attrbutes.aColorVector.location,
    3,type,false,0,0
  );
  gl.enableVertexAttribArray(pointShader.attrbutes.aColorVector.location);

  //  Point positions
  gl.bindBuffer(gl.ARRAY_BUFFER, pointShader.attrbutes.aPoint.value);
  gl.vertexAttribPointer(
    pointShader.attrbutes.aPoint.location,
    3,type,false,0,0
  );
  gl.enableVertexAttribArray(pointShader.attrbutes.aPoint.location);


  //  Draw Points                             
  gl.drawArrays(gl.POINTS, 0, num); 


  //                                                  Set Plane                                                 */
  gl.useProgram(planeShader.program);
  gl.uniformMatrix4fv(
    planeShader.uniforms.uModel.location,
    false,
    viewMatrix
  );

  gl.uniformMatrix4fv(
    planeShader.uniforms.uProjection.location,
    false,
    projectionMatrix
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, planeShader.attrbutes.aVertexPosition.value);
  gl.vertexAttribPointer(
    planeShader.attrbutes.aVertexPosition.location,
    3,type,false,0,0
  );
  gl.enableVertexAttribArray(planeShader.attrbutes.aVertexPosition.location);

  
  var modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, [0,0,0]);
  mat4.scale(modelMatrix, modelMatrix, [
    200,
    0,
    200,
  ]);
  gl.uniformMatrix4fv(
    planeShader.uniforms.uModel.location,
    false,
    modelMatrix,
  );

  gl.drawArrays(gl.TRIANGLES, 0, 6);



  


  //  Clean Up
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(pointShader.attrbutes.aPoint.location);
  gl.useProgram(null);
}


// Initialize shader program
GL.prototype.initShaderProgram =function(vsSource, fsSource) {

  const gl = this.gl;
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Shader Error: " + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

// Load Shader
function loadShader(gl, type, source)  {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
