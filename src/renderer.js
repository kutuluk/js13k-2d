import List from './list';

class Point {
  constructor(x, y) {
    this.set(x, y);
  }

  set(x, y) {
    this.x = x || 0;
    this.y = y || ((y !== 0) ? this.x : 0);
    return this;
  }

  copy(p) {
    return this.set(p.x, p.y);
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

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

class Sprite {
  constructor(bm) {
    this.bitmap = bm;
    this.anchor = new Point();
    this.position = new Point();
    this.scale = new Point(1);
    this.rotation = 0;
    this.tint = 0xffffff;
    this.alpha = 1;
    this.visible = true;
    this.n = null;
  }

  remove() {
    this.n && this.n.r();
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
    // const cvs = compileShader(vs, gl.VERTEX_SHADER);
    // const cfs = compileShader(fs, gl.FRAGMENT_SHADER);
    const cvs = compileShader(vs, 35633);
    const cfs = compileShader(fs, 35632);

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
    // gl.bufferData(type, src, usage || gl.STATIC_DRAW);
    gl.bufferData(type, src, usage || 35044);
    return buffer;
  };

  const layers = [];

  const renderer = {
    gl,

    camera: {
      at: new Point(),
      to: new Point(), // 0 -> 1
      angle: 0,
    },

    bkg(r, g, b, a = 1) {
      gl.clearColor(r, g, b, a);
    },

    texture(src, alpha, props) {
      const params = Object.assign({
        // gl.TEXTURE_MAG_FILTER: gl.LINEAR,
        10240: 9729,
        // gl.TEXTURE_MIN_FILTER: gl.LINEAR,
        10241: 9729,
        // gl.TEXTURE_WRAP_S: gl.CLAMP_TO_EDGE,
        10242: 33071,
        // gl.TEXTURE_WRAP_T: gl.CLAMP_TO_EDGE,
        10243: 33071,
      }, props);

      const tex = gl.createTexture();
      gl.bindTexture(3553, tex);
      Object.keys(params).forEach(k => gl.texParameteri(3553, k, params[k]));
      // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.texImage2D(3553, 0, 6408, 6408, 5121, src);
      // gl.generateMipmap(glTEXTURE2D);

      tex.a = alpha || 1e-3;

      return {
        tex,
        w: src.width,
        h: src.height,
        u: [0, 0, 1, 1],
      };
    },

    bitmap(tex, left, top, width, height) {
      return {
        tex: tex.tex,
        w: width,
        h: height,
        u: [left / tex.w, top / tex.h, width / tex.w, height / tex.h],
      };
    },

    layer(z) {
      let l = layers.find(c => c.z === z);

      if (!l) {
        l = new Layer(z);
        layers.push(l);
        layers.sort((a, b) => (a.z < b.z ? 1 : -1));
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
if(c.a<j)discard;
gl_FragColor=c*i;
}`;

  const program = createShaderProgram(vs, fs);

  const maxBatch = 65535;

  const bindAttrib = (name, size, stride, divisor, offset, type, norm) => {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);

    // gl.vertexAttribPointer(location, size, type || gl.FLOAT, !!norm, stride || 0, offset || 0);
    gl.vertexAttribPointer(location, size, type || 5126, !!norm, stride || 0, offset || 0);
    divisor && ext.vertexAttribDivisorANGLE(location, divisor);

    return location;
  };

  // indicesBuffer
  // createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]));
  createBuffer(34963, new Uint16Array([0, 1, 2, 2, 1, 3]));

  // vertexBuffer
  // createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]));
  createBuffer(34962, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]));

  // vertexLocation
  bindAttrib('g', 2);

  const floatSize = 2 + 2 + 1 + 2 + 4 + 1 + 1;
  const byteSize = floatSize * 4;

  const arrayBuffer = new ArrayBuffer(maxBatch * byteSize);
  const floatView = new Float32Array(arrayBuffer);
  const uintView = new Uint32Array(arrayBuffer);

  // dynamicBuffer
  // createBuffer(gl.ARRAY_BUFFER, arrayBuffer, gl.DYNAMIC_DRAW);
  createBuffer(34962, arrayBuffer, 35048);

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
  // bindAttrib('c', 4, byteSize, 1, 44, gl.UNSIGNED_BYTE, true);
  bindAttrib('c', 4, byteSize, 1, 44, 5121, true);
  // zLocation
  bindAttrib('z', 1, byteSize, 1, 48);

  /*
  const matrixLocation = gl.getUniformLocation(program, 'm');
  const textureLocation = gl.getUniformLocation(program, 'x');
  const alphaTestLocation = gl.getUniformLocation(program, 'j');
  */

  const getUniformLocation = name => gl.getUniformLocation(program, name);
  const matrixLocation = getUniformLocation('m');
  const textureLocation = getUniformLocation('x');
  const alphaTestLocation = getUniformLocation('j');

  let count = 0;
  let currentTexture;

  const flush = () => {
    if (!count) return;

    // gl.bufferSubData(gl.ARRAY_BUFFER, 0, floatView.subarray(0, count * floatSize));
    gl.bufferSubData(34962, 0, floatView.subarray(0, count * floatSize));
    // ext.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, count);
    ext.drawElementsInstancedANGLE(4, 6, 5123, 0, count);

    count = 0;
  };

  const draw = (sprite) => {
    if (!sprite.visible) return;

    if (count === maxBatch) flush();

    const {
      tex, w, h, u,
    } = sprite.bitmap;

    if (currentTexture !== tex) {
      flush();
      currentTexture = tex;
      // gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.bindTexture(3553, tex);
      gl.uniform1i(textureLocation, tex);
      gl.uniform1f(alphaTestLocation, tex.a);
    }

    let i = count * floatSize;

    floatView[i++] = sprite.anchor.x;
    floatView[i++] = sprite.anchor.y;

    floatView[i++] = sprite.scale.x * w;
    floatView[i++] = sprite.scale.y * h;

    floatView[i++] = sprite.rotation;

    floatView[i++] = sprite.position.x;
    floatView[i++] = sprite.position.y;

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

    gl.viewport(0, 0, width, height);

    // gl.disable(gl.BLEND);
    gl.disable(3042);

    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.ONE, gl.ZERO);

    // gl.enable(gl.DEPTH_TEST);
    gl.enable(2929);

    // gl.depthFunc(gl.LESS);
    gl.depthFunc(513);

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(16384 | 256);

    const { at, to, angle } = renderer.camera;

    const x = at.x - width * to.x;
    const y = at.y - height * to.y;

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const a00 = 2 / width;
    const a11 = -2 / height;
    const a30 = -(2 * x + width) / width;
    const a31 = (2 * y + height) / height;

    // prettier-ignore
    const projection = [
      c * a00, s * a11, 0, 0,
      -s * a00, c * a11, 0, 0,
      0, 0, 2 / (2 * depth), 0,

      (at.x * (1 - c) + at.y * s) * a00 + a30,
      (at.y * (1 - c) - at.x * s) * a11 + a31,
      0, 1,
    ];

    gl.useProgram(program);

    // gl.activeTexture(gl.TEXTURE0);
    gl.activeTexture(33984);

    gl.uniformMatrix4fv(matrixLocation, false, projection);

    currentTexture = null;

    const transparents = new List();

    layers.forEach((l) => {
      l.l.i((sprite) => {
        if (sprite.alpha !== 1) {
          transparents.add(sprite);
        } else {
          draw(sprite);
        }
      });
    });

    flush();

    // gl.enable(gl.BLEND);
    gl.enable(3042);

    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(1, 771);

    // gl.depthFunc(gl.LEQUAL);
    gl.depthFunc(515);

    // gl.uniform1f(alphaTestLocation, 1 / 256);
    gl.uniform1f(alphaTestLocation, 1e-3);

    transparents.i(sprite => draw(sprite));

    flush();
  };

  renderer.render();

  return renderer;
};

Renderer.Sprite = Sprite;
Renderer.Point = Point;

export default Renderer;
