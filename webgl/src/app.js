'use strict';

var vertexShaderSource = `#version 300 es

in vec3 in_position;
//in vec3 in_norm;
in vec3 in_color;

out vec3 fs_position;
//out vec3 fs_norm;
out vec3 fs_color;

uniform mat4 matrix; 

void main() {

  fs_position = in_position;
//  fs_norm = in_norm;
  fs_color = in_color;
  
  gl_Position = matrix * vec4(in_position,1.0);
  
}`;

var fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 fs_position;
//in vec3 fs_norm;
in vec3 fs_color;
out vec4 outColor;

void main() {
  outColor = vec4(fs_color,1.0);
  
}`;


var canvas;

var gl = null,
    program = null;

var projectionMatrix,
    perspProjectionMatrix,
    viewMatrix,
    worldMatrix;


//Parameters for Camera
var cx = 4.5;
var cy = 0.0;
var cz = 10.0;
var elevation = 0.0;
var angle = 0.0;

var lookRadius = 50.0;


// event handler
var mouseState = false;
var lastMouseX = -100, lastMouseY = -100;
function doMouseDown(event) {
  lastMouseX = event.pageX;
  lastMouseY = event.pageY;
  mouseState = true;
}


function doMouseUp(event) {
  lastMouseX = -100;
  lastMouseY = -100;
  mouseState = false;
}


function doMouseMove(event) {
  if(mouseState) {
    var dx = event.pageX - lastMouseX;
    var dy = lastMouseY - event.pageY;
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;

    if((dx != 0) || (dy != 0)) {
      angle = angle + 0.5 * dx;
      elevation = elevation + 0.5 * dy;
    }
  }
}


function doMouseWheel(event) {
  var nLookRadius = lookRadius + event.wheelDelta/200.0;
  if((nLookRadius > 5.0) && (nLookRadius < 100.0)) {
    lookRadius = nLookRadius;
  }
}


function main() {
  // Get a WebGL context
  var canvas = document.getElementById("c");
  canvas.addEventListener("mousedown", doMouseDown, false);
  canvas.addEventListener("mouseup", doMouseUp, false);
  canvas.addEventListener("mousemove", doMouseMove, false);
  canvas.addEventListener("mousewheel", doMouseWheel, false);

  try{
    gl= canvas.getContext("webgl2");
  } catch(e){
    console.log(e);
  }

  utils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  //gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  if(gl){

    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert("ERROR IN VS SHADER : " + gl.getShaderInfoLog(vertexShader));
    }

    var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert("ERROR IN FS SHADER : " + gl.getShaderInfoLog(fragmentShader));
    }

    // Link the two shaders into a program
    program = utils.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Load mesh using the webgl-obj-loader library
    var path = './models/objs/bathroomCabinet.obj';
    var opt = { encoding: 'utf8' };

    console.log(fs.readFile(path, opt, function (err, data){
      if (err) return console.error(err);
      return data;
    }));

    OBJ.initMeshBuffers(gl, mesh);

    // look up where the vertex data needs to go.
    // Create a buffer and put three 2d clip space points in it
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 2 components per iteration
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer

    program.vertexPositionAttribute = gl.getAttribLocation(program, "in_position");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);

    //program.vertexNormalAttribute = gl.getAttribLocation(program, "in_norm");
    //gl.enableVertexAttribArray(program.vertexNormalAttribute);

    var colorAttributeLocation = gl.getAttribLocation(program, "in_color");

    program.WVPmatrixUniform = gl.getUniformLocation(program, "matrix");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(program.vertexPositionAttribute, size, gl.FLOAT, normalize, stride, offset);

    //var normalBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    //gl.vertexAttribPointer(program.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, stride, offset);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, stride, offset);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Turn on the attribute
    gl.enableVertexAttribArray(colorAttributeLocation);

    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);

    drawScene();
  }else{
    alert("Error: WebGL not supported by your browser!");
  }
}

function animate(){
  var currentTime = (new Date).getTime();
  if(lastUpdateTime){
    var deltaC = (30 * (currentTime - lastUpdateTime)) / 1000.0;
    cubeRx += deltaC;
    cubeRy -= deltaC;
    cubeRz += deltaC;
  }
  worldMatrix = utils.MakeWorld(0.0, 0.0, 0.0, cubeRx, cubeRy, cubeRz, 1.0);
  lastUpdateTime = currentTime;
}


function drawScene() {

  var canvas = document.getElementById("c");

  // update WV matrix
  cz = lookRadius * Math.cos(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
  cx = lookRadius * Math.sin(utils.degToRad(-angle)) * Math.cos(utils.degToRad(-elevation));
  cy = lookRadius * Math.sin(utils.degToRad(-elevation));

  viewMatrix = utils.MakeView(cx, cy, cz, elevation, -angle);
  var aspect_ratio = canvas.width/canvas.height;

  perspProjectionMatrix = utils.MakePerspective(90, aspect_ratio, 0.1, 100.0);

  projectionMatrix = utils.multiplyMatrices(perspProjectionMatrix, viewMatrix);
  console.log(projectionMatrix);

  // draws the request
  gl.uniformMatrix4fv(program.WVPmatrixUniform, gl.FALSE, utils.transposeMatrix(projectionMatrix));
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0 );

  window.requestAnimationFrame(drawScene);
}


main();

