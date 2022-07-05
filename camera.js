///

export function Camera(p) {
  this.position = p;

  this.front = [0, 0, -1];
  this.up = [0, 1, 0];
  this.right = [1, 0, 0];

  // Rotation around the X axis (radians)
  this.pitch = 0;

  // Rotation around the Y axis (radians)
  this.yaw = -Math.PI / 2; // Without this you would be started rotated 90 degrees right

  // The field of view of the camera (radians)
  this.fov = 1;

  this.movement = [0, 0];
}

Camera.prototype.addPitch = function (v) {
  v = v + this.pitch;
  if (Math.abs(v) < 1.5) this.pitch = v;
  else this.pitch = 1.5 * Math.sign(v);

  this.updateVectors();
};
Camera.prototype.addYaw = function (v) {
  this.yaw += v;

  this.updateVectors();
};

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

  /* document.querySelector("#debug1").value = this.position;
  document.querySelector("#debug2").value = this.pitch;
  document.querySelector("#debug3").value = this.yaw; */

  this.position = vec3.add(
    [],
    this.position,
    vec3.add(
      [],
      this.right.map((p) => p * this.movement[1]),
      this.front.map((p) => p * this.movement[0])
    )
  );
};

Camera.prototype.updateVectors = function () {

  
  this.front[0] = Math.cos(this.pitch) * Math.cos(this.yaw);
  this.front[1] = Math.sin(this.pitch);
  this.front[2] = Math.cos(this.pitch) * Math.sin(this.yaw);

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

