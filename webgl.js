import { SingletonFactory } from "./singleton.js";

const singleton = SingletonFactory.getInstance();
var screen = [100,100];







export function GL(canvas) {

  this.buffers = {};
  this.gl =
    canvas.getContext("webgl",{premultipliedAlpha: false}) || canvas.getContext("experimental-webgl",{premultipliedAlpha: false});

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

  
  const vsSource = `
    //attribute vec4 aVertexPosition;
    uniform mat4 uView;
    uniform mat4 uProjection;   
    attribute vec3 aPoint;
    //attribute vec3 aCamPos;
    attribute float aSize;
    attribute vec3 aColorVector;
     
    varying lowp vec4 vColor;


    void main(void) {

      

      vec3 col = mix(vec3(0.,1.,0.),vec3(0.,0.,1.)*2., aColorVector.y);
      col = mix(col,vec3(1.,0.,0.), aColorVector.x); 



      gl_Position = uProjection * uView  * vec4(aPoint, 1.);
      gl_PointSize = aSize * 1000. / gl_Position.z; 

     
      
    
      vColor = vec4(col,0.9);
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      if(length(gl_PointCoord-vec2(0.5)) > 0.5)
        discard;
      gl_FragColor = vColor;
    }
  `;

  const shaderProgram = this.initShaderProgram( vsSource, fsSource);

  this.programInfo = {
    program: shaderProgram,
    attribLocations: {
      point: this.gl.getAttribLocation(shaderProgram, "aPoint"),
      //camPos: this.gl.getAttribLocation(shaderProgram, "aCamPos"),
      colorVector: this.gl.getAttribLocation(shaderProgram, "aColorVector"),
      size: this.gl.getAttribLocation(shaderProgram, "aSize"),
    },
    uniformLocations: {
      projectionMatrix: this.gl.getUniformLocation(shaderProgram, "uProjection"),
      viewMatrix: this.gl.getUniformLocation(shaderProgram, "uView"),
      
      
    },
  };

  //this.initPointsBuffers();


  return this;
}





GL.prototype.initPointsBuffers = function()  {

  const gl = this.gl;
  
  var positions = [];
  var camPos = [];
  var sizeFactors = [];
  var colorVectors = [];
  
  singleton.sets.forEach((s,k) => {
    const points = s.points;
    points.forEach((point, i) => {

      positions.push(point.x, point.y, point.z);
      //camPos.push(...singleton.camera.position);

      const next = i >= points.length-1 ? s.lastVector :[points[i+1].x,points[i+1].y,points[i+1].z];
      //const distance = vec3.distance( [point.x,point.y,point.z],previous);
      const normal = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z],next) :vec3.subtract([],next, [point.x,point.y,point.z]) 
      );

      const normalCam = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z], singleton.camera.position) :vec3.subtract([], singleton.camera.position, [point.x,point.y,point.z]) 
      );
      
      sizeFactors.push(singleton.pointSize * (singleton.sizeRatio ? (i+1) / points.length : 1) / (singleton.respawn ? s.lifeMax()/(s.lifeMax()-s.life) : 1));
      colorVectors.push(Math.abs(vec3.dot(normalCam,normal))/1.2,
        (Math.sin((s.lifeRand*100+i*15)/points.length))/2, 1); // Get the colour of the point based on the camera position + point rotation.



    });
  });
  
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

  
 /*  const camPosBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, camPosBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(camPos), gl.DYNAMIC_DRAW); */


  const sizeFactorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sizeFactorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizeFactors), gl.DYNAMIC_DRAW);

  const colorVectorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorVectorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorVectors), gl.DYNAMIC_DRAW);


  gl.bindBuffer(gl.ARRAY_BUFFER, null);



  this.buffers.points = {
    position: positionBuffer,
    //camPos: camPosBuffer,
    sizeFactor: sizeFactorBuffer,
    colorVector: colorVectorBuffer
  };

  return positions.length/3;

}




//  draw
GL.prototype.drawScene = function ()  {



  const sets = singleton.sets;
  const size = singleton.pointSize;


  const buffers = this.buffers;

  const gl = this.gl;
  const programInfo = this.programInfo;
  
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
  gl.useProgram(programInfo.program);
  
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.viewMatrix,
    false,
    viewMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );




  const num = this.initPointsBuffers();
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.points.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.point,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.point);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.points.camPos);
  gl.vertexAttribPointer(
    programInfo.attribLocations.camPos,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.camPos);


  
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.points.sizeFactor);
  gl.vertexAttribPointer(
    programInfo.attribLocations.size,
    1,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.size);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.points.colorVector);
  gl.vertexAttribPointer(
    programInfo.attribLocations.colorVector,
    3,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.colorVector);


  gl.drawArrays(gl.POINTS, 0, num); 

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(programInfo.attribLocations.point);
  gl.useProgram(null);


  
  //  points
  /* sets.forEach((s,k) => {
    const points = s.points;
    points.forEach((point, i) => {

      var modelMatrix = mat4.create();

      mat4.translate(modelMatrix, modelMatrix, [point.x, point.y, point.z]);
      const next = i >= points.length-1 ? s.lastVector :[points[i+1].x,points[i+1].y,points[i+1].z];
      //const distance = vec3.distance( [point.x,point.y,point.z],previous);

      const normal = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z],next) :vec3.subtract([],next, [point.x,point.y,point.z]) 
      );

      const normalCam = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z],camera.position) :vec3.subtract([],camera.position, [point.x,point.y,point.z]) 
      );


      const target = mat4.targetTo([],[0,0,0],normal,[1,0,0]);
      mat4.multiply(modelMatrix, modelMatrix, target);
      
      const rotationZ = Math.PI*Math.sin((k+i*3)/points.length); 
      mat4.rotate(modelMatrix, modelMatrix, rotationZ , [0,0,1]);
      
      const sizeFactor =  size * (singleton.sizeRatio ? (i+1) / points.length : 1) / (singleton.respawn ? s.lifeMax()/(s.lifeMax()-s.life) : 1);

      
      const modelColorVector = [Math.abs(vec3.dot(normalCam,normal))/1.5, Math.abs(Math.sin((s.lifeRand*1000+i*1)/points.length)), 1]; // Get the colour of the point based on the camera position + point rotation.
      



      gl.uniform1f(
        programInfo.uniformLocations.size,
        2222*sizeFactor/(vec3.distance(camera.position, [point.x,point.y,point.z])),
      );

      

      gl.uniform3fv(
        programInfo.uniformLocations.coords,
        [point.x, point.y, point.z]
      )
      
      gl.uniform3fv(
        programInfo.uniformLocations.modelColorVector,
        modelColorVector
      );

      gl.drawArrays(gl.POINTS, 0, 1); 
    
    });
    
  }); */


  
  
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
