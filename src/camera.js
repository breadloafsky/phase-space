import {vec3, mat4, mat3} from 'gl-matrix';

export function Camera(programParams) {
	this.params = programParams;
	this.position = [0,0,-10];
	this.center = [0,0,0];
	this.front = [0, 0, 1];
	this.up = [0, 1, 0];
	this.right = [1, 0, 0];
	// The field of view of the camera (radians)
	this.fov = 1;

  }
  
  Camera.prototype.setFov = function (v) {
	this.fov = v;
  };
  
  Camera.prototype.getViewMatrix = function () {
	var target = mat3.create();
	mat3.add(target, this.position, this.front);
  
	return mat4.lookAt(mat4.create(), this.position, target, this.up);
  };
  Camera.prototype.getProjectionMatrix = function (aspectRatio) {
	return mat4.perspective(mat4.create(), this.fov, aspectRatio, 0.1, 10000);
  };
  
  Camera.prototype.move = function () {  
	this.position = 
	[
		Math.cos(this.params.cameraPitch) * Math.cos(this.params.cameraYaw) * -this.params.cameraDistance + this.params.cameraTarget[0],
		Math.sin(this.params.cameraPitch) * -this.params.cameraDistance + this.params.cameraTarget[1],
		Math.cos(this.params.cameraPitch) * Math.sin(this.params.cameraYaw) * -this.params.cameraDistance + this.params.cameraTarget[2],
	];
  };
  
  Camera.prototype.updateVectors = function () {
	this.move();
	
	this.front[0] = Math.cos(this.params.cameraPitch) * Math.cos(this.params.cameraYaw);
	this.front[1] = Math.sin(this.params.cameraPitch);
	this.front[2] = Math.cos(this.params.cameraPitch) * Math.sin(this.params.cameraYaw);
  
	this.front = vec3.normalize([], this.front);
  
	this.right = vec3.normalize(
	  [],
	  vec3.cross(vec3.create(), this.front, [0, 1, 0])
	);
	this.up = vec3.normalize(
	  [],
	  vec3.cross(vec3.create(), this.right, this.front)
	);
  };
  
  