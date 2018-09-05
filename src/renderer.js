import List from './list';

const glVERTEXSHADER = 35633;
const glFRAGMENTSHADER = 35632;
const glARRAYBUFFER = 34962;
const glELEMENTARRAYBUFFER = 34963;
const glSTATICDRAW = 35044;
const glDYNAMICDRAW = 35048;
const glRGBA = 6408;
const glUNSIGNEDBYTE = 5121;
const glFLOAT = 5126;
const glTRIANGLES = 4;
const glDEPTHTEST = 2929;
const glLESS = 513;
const glLEQUAL = 515;
const glBLEND = 3042;
const glONE = 1;
const glONEMINUSSRCALPHA = 771;
const glCOLORBUFFERBIT = 16384;
const glDEPTHBUFFERBIT = 256;
const glTEXTURE0 = 33984;
const glTEXTURE2D = 3553;

class Texture {
  constructor(renderer, src, alphaTest, texParameters) {
    const { gl } = renderer;
    const params = Object.assign({
      // gl.TEXTURE_MAG_FILTER: gl.LINEAR,
      10240: 9729,
      // gl.TEXTURE_MIN_FILTER: gl.LINEAR,
      10241: 9729,
      // gl.TEXTURE_WRAP_S: gl.CLAMP_TO_EDGE,
      10242: 33071,
      // gl.TEXTURE_WRAP_T: gl.CLAMP_TO_EDGE,
      10243: 33071,
    }, texParameters);

    this.tex = gl.createTexture();
    gl.bindTexture(glTEXTURE2D, this.tex);
    Object.keys(params).forEach(k => gl.texParameteri(glTEXTURE2D, k, params[k]));
    gl.texImage2D(glTEXTURE2D, 0, glRGBA, glRGBA, glUNSIGNEDBYTE, src);
    // gl.generateMipmap(glTEXTURE2D);

    this.alphaTest = alphaTest || 1;
    this.width = src.width;
    this.height = src.height;
    this.u = [0, 0, 1, 1];
  }

  flipX() {
    const { u } = this;
    this.u = [u[0] + u[2], u[1], -u[2], u[3]];
    return this;
  }

  flipY() {
    const { u } = this;
    this.u = [u[0], u[1] + u[3], u[2], -u[3]];
    return this;
  }
}

/* eslint-disable constructor-super */
/* eslint-disable no-this-before-super */
class Bitmap extends Texture {
  constructor(texture, left, top, width, height) {
    this.texture = texture;
    this.width = width;
    this.height = height;
    this.u = [
      left / texture.width,
      top / texture.height,
      width / texture.width,
      height / texture.height,
    ];
  }

  get alphaTest() {
    return this.texture.alphaTest;
  }

  get tex() {
    return this.texture.tex;
  }

  clone() {
    const b = new Bitmap({});
    Object.assign(b, this);
    b.u = b.u.slice();
    return b;
  }
}
/* eslint-enable constructor-super */
/* eslint-enable no-this-before-super */

class Layer {
  constructor(z) {
    this.l = new List();
    this.z = z;
  }

  add(sprite) {
    sprite.n = this.l.add(sprite);
    sprite.z = this.z;
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
    const cvs = compileShader(vs, glVERTEXSHADER);
    const cfs = compileShader(fs, glFRAGMENTSHADER);

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
    gl.bufferData(type, src, usage || glSTATICDRAW);
    return buffer;
  };

  const layers = [];

  const renderer = {
    gl,

    camera: {
      at: new Renderer.Point(),
      to: new Renderer.Point(), // 0 -> 1
      angle: 0,
    },

    bkg(r, g, b, a = 1) {
      gl.clearColor(r, g, b, a);
    },

    layer(z) {
      let l = layers.find(c => c.z === z);

      if (!l) {
        l = new Layer(z);
        layers.push(l);
        layers.sort((a, b) => b.z - a.z);
      }

      return l;
    },
  };

  const zeroLayer = renderer.layer(0);

  renderer.add = (sprite) => {
    zeroLayer.add(sprite);
  };

  const vs = `attribute vec2 g;
attribute vec2 a;
attribute vec2 t;
attribute float r;
attribute vec2 s;
attribute vec4 u;
attribute vec4 c;
attribute float z;
uniform mat4 m;
varying vec2 v;
varying vec4 i;
void main(){
v=u.xy+g*u.zw;
i=c.abgr;
vec2 p=(g-a)*s;
float q=cos(r);
float w=sin(r);
p=vec2(p.x*q-p.y*w,p.x*w+p.y*q);
p+=a+t;
gl_Position=m*vec4(p,z,1);}`;

  const fs = `precision mediump float;
uniform sampler2D x;
uniform float j;
varying vec2 v;
varying vec4 i;
void main(){
vec4 c=texture2D(x,v);
gl_FragColor=c*i;
if(j>0.0){
if(c.a<j)discard;
gl_FragColor.a=1.0;
};}`;

  const program = createShaderProgram(vs, fs);

  const maxBatch = 65535;

  const bindAttrib = (name, size, stride, divisor, offset, type, norm) => {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);

    gl.vertexAttribPointer(location, size, type || glFLOAT, !!norm, stride || 0, offset || 0);
    divisor && ext.vertexAttribDivisorANGLE(location, divisor);

    return location;
  };

  // indicesBuffer
  createBuffer(glELEMENTARRAYBUFFER, new Uint8Array([0, 1, 2, 2, 1, 3]));

  // vertexBuffer
  createBuffer(glARRAYBUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]));

  // vertexLocation
  bindAttrib('g', 2);

  const floatSize = 2 + 2 + 1 + 2 + 4 + 1 + 1;
  const byteSize = floatSize * 4;

  const arrayBuffer = new ArrayBuffer(maxBatch * byteSize);
  const floatView = new Float32Array(arrayBuffer);
  const uintView = new Uint32Array(arrayBuffer);

  // dynamicBuffer
  createBuffer(glARRAYBUFFER, arrayBuffer, glDYNAMICDRAW);

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
  // colorLocation
  bindAttrib('c', 4, byteSize, 1, 44, glUNSIGNEDBYTE, true);
  // zLocation
  bindAttrib('z', 1, byteSize, 1, 48);

  const getUniformLocation = name => gl.getUniformLocation(program, name);
  const matrixLocation = getUniformLocation('m');
  const textureLocation = getUniformLocation('x');
  const alphaTestLocation = getUniformLocation('j');

  let count = 0;
  let currentTexture;
  let alphaTestMode;

  const flush = () => {
    if (!count) return;

    gl.bufferSubData(glARRAYBUFFER, 0, floatView.subarray(0, count * floatSize));
    ext.drawElementsInstancedANGLE(glTRIANGLES, 6, glUNSIGNEDBYTE, 0, count);
    count = 0;
  };

  const draw = (sprite) => {
    if (!sprite.visible) return;

    if (count === maxBatch) flush();

    const {
      bitmap, scale, position, anchor,
    } = sprite;

    const { tex, u } = bitmap;

    if (currentTexture !== tex) {
      flush();
      currentTexture = tex;
      gl.bindTexture(glTEXTURE2D, tex);
      gl.uniform1i(textureLocation, tex);
      gl.uniform1f(alphaTestLocation, alphaTestMode ? bitmap.alphaTest : 0);
    }

    let i = count * floatSize;

    floatView[i++] = anchor.x;
    floatView[i++] = anchor.y;

    floatView[i++] = scale.x * bitmap.width;
    floatView[i++] = scale.y * bitmap.height;

    floatView[i++] = sprite.rotation;

    floatView[i++] = position.x;
    floatView[i++] = position.y;

    /* eslint-disable prefer-destructuring */
    floatView[i++] = u[0];
    floatView[i++] = u[1];
    floatView[i++] = u[2];
    floatView[i++] = u[3];
    /* eslint-enable prefer-destructuring */

    uintView[i++] = (((sprite.tint & 0xffffff) << 8) | ((sprite.alpha * 255) & 255)) >>> 0;

    floatView[i++] = -sprite.z;

    count++;
  };

  const depth = 1e+5;

  renderer.render = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const { at, to, angle } = renderer.camera;

    const x = at.x - width * to.x;
    const y = at.y - height * to.y;

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const w = 2 / width;
    const h = -2 / height;

    /*

    |   1 |    0| 0| 0|
    |   0 |    1| 0| 0|
    |   0 |    0| 1| 0|
    | at.x| at.y| 0| 1|

    x

    |  c| s| 0| 0|
    | -s| c| 0| 0|
    |  0| 0| 1| 0|
    |  0| 0| 0| 1|

    x

    |     1|     0| 0| 0|
    |     0|     1| 0| 0|
    |     0|     0| 1| 0|
    | -at.x| -at.y| 0| 1|

    x

    |     2/width|           0|       0| 0|
    |           0|   -2/height|       0| 0|
    |           0|           0| 1/depth| 0|
    | -2x/width-1| 2y/height+1|       0| 1|

    */

    // prettier-ignore
    const projection = [
      c * w, s * h, 0, 0,
      -s * w, c * h, 0, 0,
      0, 0, 1 / depth, 0,

      (at.x * (1 - c) + at.y * s) * w - 2 * x / width - 1,
      (at.y * (1 - c) - at.x * s) * h + 2 * y / height + 1,
      0, 1,
    ];

    gl.useProgram(program);

    gl.uniformMatrix4fv(matrixLocation, false, projection);

    gl.viewport(0, 0, width, height);
    gl.disable(glBLEND);
    gl.enable(glDEPTHTEST);
    gl.depthFunc(glLESS);
    gl.clear(glCOLORBUFFERBIT | glDEPTHBUFFERBIT);
    gl.activeTexture(glTEXTURE0);

    const transparents = new List();

    currentTexture = null;
    alphaTestMode = true;
    layers.forEach((l) => {
      l.l.i((sprite) => {
        if ((sprite.alpha !== 1) || (sprite.bitmap.alphaTest === 0)) {
          transparents.add(sprite);
        } else {
          draw(sprite);
        }
      });
    });
    flush();

    gl.enable(glBLEND);
    // gl.blendFunc(gl.SRC_ALPHA, glONEMINUSSRCALPHA);
    gl.blendFunc(glONE, glONEMINUSSRCALPHA);
    gl.depthFunc(glLEQUAL);

    gl.uniform1f(alphaTestLocation, 0);
    alphaTestMode = false;
    transparents.i(sprite => draw(sprite));
    flush();
  };

  renderer.render();

  return renderer;
};

Renderer.Point = class Point {
  constructor(x, y) {
    this.set(x, y);
  }

  set(x, y) {
    this.x = x || 0;
    this.y = y || ((y !== 0) ? this.x : 0);
    return this;
  }
};

Renderer.Sprite = class Sprite {
  constructor(bitmap) {
    this.bitmap = bitmap;
    this.anchor = new Renderer.Point();
    this.position = new Renderer.Point();
    this.scale = new Renderer.Point(1);
    this.rotation = 0;
    this.tint = 0xffffff;
    this.alpha = 1;
    this.visible = true;
    this.n = null;
  }

  remove() {
    this.n && this.n.r();
  }
};

Renderer.Texture = Texture;
Renderer.Bitmap = Bitmap;

export default Renderer;
