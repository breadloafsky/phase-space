import { shaders } from './shaders/shaders';
import {vec3, mat4, mat3} from 'gl-matrix';
import { get } from 'svelte/store';
import { metaParams } from "./stores.ts";

var screen = [100,100];


// plane vertices
const screenData ={
	coords:[
		-1.0,-1.0, 
		1.0,-1.0,
		1.0, 1.0, 
		-1.0,-1.0, 
		1.0, 1.0,
		-1.0, 1.0,
	],
	texCoords:[
		0.0, 0.0, 
		1.0, 0.0,
		1.0, 1.0, 
		0.0, 0.0, 
		1.0, 1.0,
		0.0, 1.0,
	]
}



export function Scene(canvas, _ode) {
	this.ode = _ode;
	this.fbo = {
		framebuffer : {},
		texture:{},
		depthBuffer:{},
	};
	this.shaders ={
		point:{
		program: {},//pointsShader,
		attributes: {
			aPoint: {location:null},
			aColorVector: {location:null},
			aSize: {location:null},
		},
		uniforms: {
			uProjection: {location:null},
			uView: {location:null},
		},
		},
		plane:{
		program: {},//planeShader,
		attributes: {
			aVertexPosition: {location:null},
		},
		uniforms: {
			uProjection:{location:null},
			uView: {location:null},
			uModel: {location:null},
		},
		},
		frame:{
		program: {},
		attributes: {
			aTexcoord: {value:null},
			aPos: {value:null},
		},
		uniforms: {
			uTexture: {value:null},
		},
		}
	};

	const params = {
		premultipliedAlpha: false, 
		antialias: true,
		depth:true,
	};

	this.gl =
		canvas.getContext("webgl",params) || canvas.getContext("experimental-webgl",params);

	this.ext = (
		this.gl.getExtension('EXT_texture_filter_anisotropic') ||
		this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
		this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
	);

	
	const resize = () =>{
		screen = [
			window.innerWidth * 0.9,
			window.innerHeight * 0.9,
		];
		canvas.setAttribute("width", screen[0]);
		canvas.setAttribute("height", screen[1]);
		this.initFBO();
		this.gl.viewport( 0, 0, screen[0], screen[1] );
	}

	window.addEventListener("resize",() => resize());
	resize();

	/* this.gl.enable(this.gl.SAMPLE_COVERAGE);
	this.gl.enable(this.gl.SAMPLE_ALPHA_TO_COVERAGE);
	this.gl.sampleCoverage(0.2,false); */


	if (!this.gl) {
		alert("WebGL ERROR.");
		return;
	}
	

	for (let shaderName in this.shaders)
	{
		let shader = this.shaders[shaderName];
		shader.program = this.initShaderProgram( 
		shaders[shaderName+"Vs"], 
		shaders[shaderName+"Fs"], 
		);
		for(let attributeName in shader.attributes){
		shader.attributes[attributeName].location = this.gl.getAttribLocation(shader.program, attributeName);
		}
		for(let uniformName in shader.uniforms){
		shader.uniforms[uniformName].location = this.gl.getUniformLocation(shader.program, uniformName);
		}
	}

	this.initPlaneBuffer();
	this.initFBO();

	return this;
}

Scene.prototype.initFBO = function(){
	this.initFBO();
	return this;
}

Scene.prototype.initFBO = function(){
  const gl = this.gl;


  const texWidth =  gl.canvas.width;
  const texHeight = gl.canvas.height;
  
  const framebuffer =  gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texWidth, texHeight, 0,  gl.RGBA, gl.UNSIGNED_BYTE, null);
  

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


  /* const max = gl.getParameter(this.ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
  gl.texParameterf(gl.TEXTURE_2D, this.ext.TEXTURE_MAX_ANISOTROPY_EXT,max); */
  

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  

  //
  const depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, texWidth, texHeight);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);



  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  
  this.fbo.framebuffer.value = framebuffer;
  this.fbo.texture.value = texture;
  this.fbo.depthBuffer.value = depthBuffer;


  /////////////////////

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenData.coords), gl.DYNAMIC_DRAW);
  
  const textCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenData.texCoords), gl.DYNAMIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  this.shaders.frame.attributes.aPos.value = positionBuffer;
  this.shaders.frame.attributes.aTexcoord.value = textCoordBuffer;

}

Scene.prototype.initPlaneBuffer = function(){
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

    this.shaders.plane.attributes.aVertexPosition.value = positionBuffer;

}

// set the buffers
Scene.prototype.initPointsBuffers = function()  {
  const gl = this.gl;
  
  var positions = [];
  var sizeFactors = [];
  var colorVectors = [];
  const dimensions = get(metaParams).dimMap; 

  this.ode.sets.forEach((s,k) => {
    
    const points = s.points.map(p=>{return {...p, x:p[dimensions[0]], y:p[dimensions[1]], z:p[dimensions[2]]}});  //remap dimensions
    const lastDir = {x:s.lastDir[dimensions[0]], y:s.lastDir[dimensions[1]],  
      z:s.lastDir[dimensions[2]]};

    points.forEach((point, i) => {
      
      const next = i >= points.length-1 ? [lastDir.x,lastDir.y,lastDir.z] :[points[i+1].x,points[i+1].y,points[i+1].z];
      const normal = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z],next) :vec3.subtract([],next, [point.x,point.y,point.z]) 
      );
      const normalCam = vec3.normalize([],
        i == 0 ? vec3.subtract([], [point.x,point.y,point.z], this.ode.camera.position) :vec3.subtract([], this.ode.camera.position, [point.x,point.y,point.z]) 
      );
      positions.push(point.x, point.y, point.z);
      sizeFactors.push(this.ode.params.pointSize * (this.ode.params.sizeRatio ? (i+1) / points.length : 1) / (this.ode.params.respawn ? s.lifeMax()/(s.lifeMax()-s.lifeCount) : 1));
      
      colorVectors.push( Math.abs(vec3.dot(normalCam,normal))/1.2,
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

  this.shaders.point.attributes.aColorVector.value = colorVectorBuffer;
  this.shaders.point.attributes.aPoint.value = positionBuffer;
  this.shaders.point.attributes.aSize.value = sizeFactorBuffer;

  return positions.length/3;

}




Scene.prototype.drawPoints = function(projectionMatrix, viewMatrix){

  const pointShader = this.shaders.point;
  const gl = this.gl;

  

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
  gl.bindBuffer(gl.ARRAY_BUFFER, pointShader.attributes.aSize.value);
  gl.vertexAttribPointer(
    pointShader.attributes.aSize.location,
    1,type,false,0,0
  );
  gl.enableVertexAttribArray(pointShader.attributes.aSize.location);
  

  //  Colour definition
  gl.bindBuffer(gl.ARRAY_BUFFER, pointShader.attributes.aColorVector.value);
  gl.vertexAttribPointer(
    pointShader.attributes.aColorVector.location,
    3,type,false,0,0
  );
  gl.enableVertexAttribArray(pointShader.attributes.aColorVector.location);
  
  //  Point positions
  gl.bindBuffer(gl.ARRAY_BUFFER, pointShader.attributes.aPoint.value);
  gl.vertexAttribPointer(
    pointShader.attributes.aPoint.location,
    3,type,false,0,0
  );
  gl.enableVertexAttribArray(pointShader.attributes.aPoint.location);
  
  //  Draw Points                             
  gl.drawArrays(gl.POINTS, 0, num); 
}

Scene.prototype.drawPlane = function(projectionMatrix, viewMatrix){

  const planeShader = this.shaders.plane;

  const pos = this.ode.camera.position;
  const gl = this.gl;
  gl.useProgram(planeShader.program);
  gl.uniformMatrix4fv(
    planeShader.uniforms.uView.location,
    false,
    viewMatrix
  );

  gl.uniformMatrix4fv(
    planeShader.uniforms.uProjection.location,
    false,
    projectionMatrix
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, planeShader.attributes.aVertexPosition.value);
  gl.vertexAttribPointer(
    planeShader.attributes.aVertexPosition.location,
    3,gl.FLOAT,false,0,0
  );
  gl.enableVertexAttribArray(planeShader.attributes.aVertexPosition.location);
  
  var modelMatrix = mat4.create();
  mat4.translate(modelMatrix, modelMatrix, [pos[0],0,pos[2]]);
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
 
}



// draw scene
Scene.prototype.drawScene = function ()  {

  const gl = this.gl;
  const pointShader = this.shaders.point;
  const planeShader = this.shaders.plane;

  const camera = this.ode.camera;
  camera.updateVectors();

  gl.bindFramebuffer(gl.FRAMEBUFFER,this.fbo.framebuffer.value);  // bind the frame buffer
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  //  clear scene
  gl.clearColor(0.0, 0.0, 0.0, 0.0);  
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  


  const projectionMatrix = camera.getProjectionMatrix(screen[0] / screen[1]);
  const viewMatrix = camera.getViewMatrix();

  // draw points & the grid
  this.drawPoints(projectionMatrix, viewMatrix);


  // draw the coordinates plane if needed
  if(get(metaParams).showGrid)
  {
    gl.disable(gl.CULL_FACE);
    this.drawPlane(projectionMatrix, viewMatrix);
    gl.enable(gl.CULL_FACE);
  }
  

  // render the frame
  gl.useProgram(this.shaders.frame.program);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, this.fbo.texture.value);

  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  

  gl.bindBuffer(gl.ARRAY_BUFFER, this.shaders.frame.attributes.aPos.value);
  gl.vertexAttribPointer(
    this.shaders.frame.attributes.aPos.location,
    2,gl.FLOAT,false,0,0
  );
  //gl.enableVertexAttribArray(gl.ARRAY_BUFFER, this.shaders.frame.attributes.aPos.location);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.shaders.frame.attributes.aTexcoord.value);
  gl.vertexAttribPointer(
    this.shaders.frame.attributes.aTexcoord.location,
    2,gl.FLOAT,false,0,0
  );
  //gl.enableVertexAttribArray(this.shaders.frame.attributes.aTexcoord.location);

 
  gl.uniform1i(this.fbo.texture.location, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 6);


  //  Clean Up
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(pointShader.attributes.aPoint.location);
  gl.useProgram(null);

  
}


// Initialize shader program
Scene.prototype.initShaderProgram =function(vsSource, fsSource) {

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
