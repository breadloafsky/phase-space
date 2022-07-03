import { Camera } from "./camera.js";
import { SingletonFactory } from "./singleton.js";

const singleton = SingletonFactory.getInstance();

var camera = new Camera([0, 0, 1]);

var mouseDown;

var movement = [0, 0];

var scale = 0.1;
var screen = [100,100];



document.querySelector("#size").addEventListener("input", (e) =>{
  scale = e.target.value;
});

const btnVec = document.querySelector("#btnVec").addEventListener("click", (e) =>{
  showVectors =! showVectors;
});

var showVectors = true;


export function GL(canvas) {

  this.gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  canvas.addEventListener("mousedown", (e) => {
    mouseDown = e.button;
  });
  canvas.addEventListener("mouseup", () => {
    mouseDown = null;
  });

  const resize = () =>{
    screen = [
      canvas.parentElement.offsetWidth,
      canvas.parentElement.offsetHeight,
    ];
    canvas.setAttribute("width", screen[0]);
    canvas.setAttribute("height", screen[1]);

    this.gl.viewport( 0, 0, screen[0], screen[1] );
  }

  window.addEventListener("resize",() => resize());
  resize();

  canvas.addEventListener("mousemove", (e) => {
    if (mouseDown == 0) {
      camera.yaw += e.movementX / 100;
      camera.addPitch(-e.movementY / 100);
    }
  });
  canvas.onwheel = (e) => {
    camera.position = vec3.add(
      [],
      camera.position,
      camera.front.map((p) => (p * -Math.sign(e.deltaY)) / 4)
    );
  };

  document.addEventListener("keydown", (e) => {
    if (e.code == "KeyW") movement[0] = 1;
    else if (e.code == "KeyS") movement[0] = -1;
    else if (e.code == "KeyA") movement[1] = -1;
    else if (e.code == "KeyD") movement[1] = 1;
  });
  document.addEventListener("keyup", (e) => {
    if (["KeyW", "KeyS"].includes(e.code)) movement[0] = 0;
    else if (["KeyA", "KeyD"].includes(e.code)) movement[1] = 0;
  });

  camera.setFov(1);



  if (!this.gl) {
    alert("WebGL ERROR.");
    return;
  }


  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform mat4 uProjection;
    
    varying lowp vec4 vColor;
    
    void main(void) {
      gl_Position = uProjection * uView*  uModel *  aVertexPosition; 
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  const shaderProgram = this.initShaderProgram( vsSource, fsSource);

  this.programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: this.gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: this.gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: this.gl.getUniformLocation(shaderProgram, "uProjection"),
      modelMatrix: this.gl.getUniformLocation(shaderProgram, "uModel"),
      viewMatrix: this.gl.getUniformLocation(shaderProgram, "uView"),
    },
  };

  this.initBuffers();

  return this;
}


GL.prototype.initBuffers = function()  {

  const gl = this.gl;
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const size = 1;

  var positions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
    1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0,
    -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
    1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0,
    1.0, 1.0, -1.0, 1.0, -1.0,
  ].map((p) => p * size);

  var faceColors = [];

  faceColors = [
    [1.0, 0.0, 0.0, 1.0],
    [1.0, 0.0, 0.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
    [0.0, 0.0, 1.0, 1.0],
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

  var colors = [];
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    colors = colors.concat(c, c, c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  this.buffers = {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}



GL.prototype.getPos = function ()  {
  return camera.front;
};




//  draw
GL.prototype.drawScene = function ()  {

  let sets = singleton.sets;

  let vectors = singleton.vectors;




  const buffers = this.buffers;

  const gl = this.gl;
  const programInfo = this.programInfo;
  camera.position = vec3.add(
    [],
    camera.position,
    vec3.add(
      [],
      camera.right.map((p) => p * movement[1]),
      camera.front.map((p) => p * movement[0])
    )
  );
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  //gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);


  //  points
  sets.forEach((s,k) => {
    const points = s.points;
    
    points.forEach((point, i) => {
      var modelMatrix = mat4.create();
      mat4.translate(modelMatrix, modelMatrix, [point.x, point.y, point.z]);
      const previous = i == 0 ? [points[i+1].x,points[i+1].y,points[i+1].z] : [points[i-1].x,points[i-1].y,points[i-1].z];
      //const distance = vec3.distance( [point.x,point.y,point.z],previous);
      const normal = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z],previous) :vec3.subtract([],previous, [point.x,point.y,point.z]) 
      );
      const target = mat4.targetTo([],[0,0,0],normal,[1,0,0]);
      mat4.multiply(modelMatrix, modelMatrix, target);
      mat4.rotate(modelMatrix, modelMatrix,Math.PI*Math.sin((k+i)/points.length), [0,0,1]);

      mat4.scale(modelMatrix, modelMatrix, [
        (scale * (i+1)) / points.length / (s.lifeMax/(s.lifeMax-s.life)),
        (scale * (i+1)) / points.length / (s.lifeMax/(s.lifeMax-s.life)),
        (scale * (i+1)) / points.length / (s.lifeMax/(s.lifeMax-s.life)),
      ]);

      gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelMatrix,
        false,
        modelMatrix
      );
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    });
    
  });


  //  debug
  if(showVectors)
  {
    vectors.forEach((s,k) => {
      const points = s.points;
      
       points.forEach((point, i) => {
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [point.x, point.y, point.z]);
        const previous = i == 0 ? [points[i+1].x,points[i+1].y,points[i+1].z] : [points[i-1].x,points[i-1].y,points[i-1].z];


        const distance = vec3.distance( [point.x,point.y,point.z],previous);
        const normal = vec3.normalize([],
          i == 0 ? vec3.subtract([], [point.x,point.y,point.z],previous) :vec3.subtract([],previous, [point.x,point.y,point.z]) 
        );
        const target = mat4.targetTo([],[0,0,0],normal,[1,0,0]);
        mat4.multiply(modelMatrix, modelMatrix, target);
        mat4.rotate(modelMatrix, modelMatrix,Math.PI*Math.sin((k+i)/points.length), [0,0,1]);
  
        mat4.scale(modelMatrix, modelMatrix, [
          1/(21),//1/(distance+0.1),
          1/(21),
          1/(21),
        ]);
        mat4.scale(modelMatrix, modelMatrix, [
          (0.2 * (50)) / 2,//points.length,
          (0.2 * (50)) / 2,//points.length,
          (0.2 * (50)) / 2,//points.length,
        ]);
  
        /* mat4.scale(modelMatrix, modelMatrix, [
          (0.2 * (points.length-i)) / points.length,
          (0.2* (points.length-i)) / points.length,
          (0.2* (points.length-i)) / points.length,
        ]); */
        
  
  
        gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelMatrix,
          false,
          modelMatrix
        );
        gl.drawArrays(gl.TRIANGLES, 0, 36);
  
      }); 
      
    });  
  }
  
  
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
