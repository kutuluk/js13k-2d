import List from './list';

class Layer {
  constructor(z) {
    this.l = new List();
    this.z = z;
  }

  add(sprite) {
    sprite.node = this.l.add(sprite);
  }
}

class Sprite {
  constructor(bm) {
    this.bitmap = bm;
    this.anchor = { x: 0.5, y: 0.5 };
    this.position = { x: 0, y: 0 };
    this.rotation = 0;
    this.scale = { x: 1, y: 1 };
    this.tint = 0xffffff;
    this.alpha = 1;
    this.visible = true;
    this.node = null;
  }

  remove() {
    this.node && this.node.remove();
  }
}

const Renderer = (canvas, options) => {
  const gl = canvas.getContext('webgl', options);

  /*
  if (!gl) {
    throw new Error('WebGL not found');
  }
  */

  const ext = gl.getExtension('ANGLE_instanced_arrays');

  /*
  if (!ext) {
    throw new Error('Requared ANGLE_instanced_arrays extension not found');
  }
  */

  const compileShader = (source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    /*
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(error);
    }
    */

    return shader;
  };

  const createShaderProgram = (vs, fs) => {
    const cvs = compileShader(vs, gl.VERTEX_SHADER);
    const cfs = compileShader(fs, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, cvs);
    gl.attachShader(program, cfs);
    gl.linkProgram(program);

    /*
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(error);
    }
    */

    return program;
  };

  const createBuffer = (type, src, usage) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, src, usage);
    return buffer;
  };

  const texture = (src, wraps, wrapt, min, mag) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wraps || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapt || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag || gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min || gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.generateMipmap(gl.TEXTURE_2D);

    return {
      tex,
      width: src.width,
      height: src.height,
      uvs: [0, 0, 1, 1],
    };
  };

  const bitmap = (tex, left, top, right, bottom) => {
    const width = right - left + 1;
    const height = bottom - top + 1;
    const r = {
      tex: tex.tex,
      width,
      height,
      uvs: [
        left / tex.width,
        top / tex.height,
        width / tex.width,
        height / tex.height,
      ],
    };
    return r;
  };

  const layers = [];

  const layer = (z) => {
    const exist = layers.find(c => c.z === z);
    if (exist) return exist;

    const l = new Layer(z);
    layers.push(l);
    layers.sort((a, b) => {
      if (a.z < b.z) return -1;
      if (a.z > b.z) return 1;
      return 0;
    });

    return l;
  };

  const zeroLayer = layer(0);

  const add = (sprite) => {
    zeroLayer.add(sprite);
  };

  const vs = `precision mediump float;
attribute vec2 g;
attribute vec2 a;
attribute vec2 t;
attribute float r;
attribute vec2 s;
attribute vec4 u;
attribute vec4 c;
uniform mat4 m;
varying vec2 v;
varying vec4 vc;
void main(){
v=u.xy+g*u.zw;
vc=c.abgr;
vec2 p=(g-a)*s;
float cr=cos(r);
float sr=sin(r);
p=vec2(p.x*cr-p.y*sr,p.x*sr+p.y*cr);
p+=a+t;
gl_Position=m*vec4(p,0,1);}`;

  const fs = `precision mediump float;
uniform sampler2D x;
varying vec2 v;
varying vec4 vc;
void main(){
gl_FragColor=texture2D(x,v)*vc;}`;

  const program = createShaderProgram(vs, fs);

  const maxBatch = 65535;

  const bindAttrib = (name, size, stride, divisor, offset, type, norm) => {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);

    gl.vertexAttribPointer(location, size, type || gl.FLOAT, !!norm, stride || 0, offset || 0);
    divisor && ext.vertexAttribDivisorANGLE(location, divisor);

    return location;
  };

  // indicesBuffer
  createBuffer(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 2, 1, 3]),
    gl.STATIC_DRAW,
  );

  // vertexBuffer
  createBuffer(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
    gl.STATIC_DRAW,
  );

  // geoLocation
  bindAttrib('g', 2);

  const floatSize = 2 + 2 + 1 + 2 + 4 + 1;
  const byteSize = floatSize * 4;

  const arrayBuffer = new ArrayBuffer(maxBatch * byteSize);
  const floatView = new Float32Array(arrayBuffer);
  const uintView = new Uint32Array(arrayBuffer);

  // dynamicBuffer
  createBuffer(gl.ARRAY_BUFFER, arrayBuffer, gl.DYNAMIC_DRAW);

  // anchorLocation
  bindAttrib('a', 2, byteSize, 1);
  // scaleLocation
  bindAttrib('s', 2, byteSize, 1, 8);
  // rotationLocation
  bindAttrib('r', 1, byteSize, 1, 16);
  // translationLocation
  bindAttrib('t', 2, byteSize, 1, 20);
  // uvsLocation
  bindAttrib('u', 4, byteSize, 1, 28);
  // tintLocation
  bindAttrib('c', 4, byteSize, 1, 44, gl.UNSIGNED_BYTE, true);

  const matrixLocation = gl.getUniformLocation(program, 'm');
  const textureLocation = gl.getUniformLocation(program, 'x');

  let count = 0;
  let currentTexture;

  const flush = () => {
    if (!count) return;

    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      0,
      floatView.subarray(0, count * floatSize),
    );

    ext.drawElementsInstancedANGLE(
      gl.TRIANGLES,
      6,
      gl.UNSIGNED_SHORT,
      0,
      count,
    );

    count = 0;
  };

  const draw = (sprite) => {
    if (!sprite.visible) return;

    if (count === maxBatch) flush();

    const {
      tex, width, height, uvs,
    } = sprite.bitmap;

    if (currentTexture !== tex) {
      flush();
      currentTexture = tex;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(textureLocation, tex);
    }

    let i = count * floatSize;

    floatView[i++] = sprite.anchor.x;
    floatView[i++] = sprite.anchor.y;

    floatView[i++] = sprite.scale.x * width;
    floatView[i++] = sprite.scale.y * height;

    floatView[i++] = sprite.rotation;

    floatView[i++] = sprite.position.x;
    floatView[i++] = sprite.position.y;

    /* eslint-disable prefer-destructuring */
    floatView[i++] = uvs[0];
    floatView[i++] = uvs[1];
    floatView[i++] = uvs[2];
    floatView[i++] = uvs[3];
    /* eslint-enable prefer-destructuring */

    uintView[i++] = (((sprite.tint & 0xffffff) << 8) | ((sprite.alpha * 255) & 0xff)) >>> 0;

    count++;
  };

  const render = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    gl.viewport(0, 0, width, height);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // prettier-ignore
    const projection = [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 1, 0,
      -1, 1, 0, 1,
    ];

    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);

    gl.uniformMatrix4fv(matrixLocation, false, projection);

    currentTexture = null;

    layers.forEach(l => l.l.iterate(sprite => draw(sprite)));

    flush();
  };

  render();

  return {
    gl,
    bkg(r, g, b) {
      gl.clearColor(r, g, b, 1);
    },
    texture,
    bitmap,
    layer,
    add,
    render,
  };
};

Renderer.Sprite = Sprite;

export default Renderer;
