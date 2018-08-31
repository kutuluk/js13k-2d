import List from './list';

class Layer {
  constructor(z) {
    this.l = new List();
    this.z = z;
  }

  add(sprite) {
    sprite.node = this.l.add(sprite);
    sprite.z = this.z;
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
    this.node && this.node.r();
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
    gl.bufferData(type, src, usage);
    return buffer;
  };

  const layers = [];

  const renderer = {
    gl,

    camera: {
      at: { x: 0, y: 0 },
      to: { x: 0, y: 0 }, // 0 -> 1
      angle: 0,
    },

    bkg(r, g, b, a) {
      gl.clearColor(r, g, b, a || (a === 0 ? 0 : 1));
    },

    texture(src, wraps, wrapt, min, mag) {
      const tex = gl.createTexture();
      const glTEXTURE2D = 3553;

      /*
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wraps || gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapt || gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag || gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min || gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.generateMipmap(gl.TEXTURE_2D);
      */
      gl.bindTexture(glTEXTURE2D, tex);
      gl.texParameteri(glTEXTURE2D, 10242, wraps || 33071);
      gl.texParameteri(glTEXTURE2D, 10243, wrapt || 33071);
      gl.texParameteri(glTEXTURE2D, 10240, mag || 9729);
      gl.texParameteri(glTEXTURE2D, 10241, min || 9729);
      gl.texImage2D(glTEXTURE2D, 0, 6408, 6408, 5121, src);
      // gl.generateMipmap(glTEXTURE2D);

      tex.alphaTest = 1 / 256;

      return {
        tex,
        width: src.width,
        height: src.height,
        uvs: [0, 0, 1, 1],
      };
    },

    bitmap(tex, left, top, right, bottom) {
      const width = right - left + 1;
      const height = bottom - top + 1;
      return {
        tex: tex.tex,
        width,
        height,
        uvs: [left / tex.width, top / tex.height, width / tex.width, height / tex.height],
      };
    },

    layer(z) {
      const exist = layers.find(c => c.z === z);
      if (exist) return exist;

      const l = new Layer(z);
      layers.push(l);
      layers.sort((a, b) => {
        /*
        if (a.z < b.z) return -1;
        if (a.z > b.z) return 1;
        */
        if (a.z < b.z) return 1;
        if (a.z > b.z) return -1;
        return 0;
      });

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

    gl.vertexAttribPointer(location, size, type || gl.FLOAT, !!norm, stride || 0, offset || 0);
    divisor && ext.vertexAttribDivisorANGLE(location, divisor);

    return location;
  };

  // indicesBuffer
  // createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 2, 1, 3]), gl.STATIC_DRAW);
  createBuffer(34963, new Uint16Array([0, 1, 2, 2, 1, 3]), 35044);

  // vertexBuffer
  // createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
  createBuffer(34962, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), 35044);

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

  const matrixLocation = gl.getUniformLocation(program, 'm');
  const textureLocation = gl.getUniformLocation(program, 'x');
  const alphaTestLocation = gl.getUniformLocation(program, 'j');

  let count = 0;
  let currentTexture;

  const flush = () => {
    if (!count) return;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, floatView.subarray(0, count * floatSize));
    ext.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, count);

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
      gl.uniform1f(alphaTestLocation, tex.alphaTest);
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

    uintView[i++] = (((sprite.tint & 0xffffff) << 8) | ((sprite.alpha * 255) & 255)) >>> 0;

    floatView[i++] = -sprite.z;

    count++;
  };

  // prettier-ignore
  const orthographic = (left, right, bottom, top, near, far) => [
    2 / (right - left), 0, 0, 0,
    0, 2 / (top - bottom), 0, 0,
    0, 0, 2 / (near - far), 0,

    (left + right) / (left - right),
    (bottom + top) / (bottom - top),
    (near + far) / (near - far),
    1,
  ];

  renderer.render = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width;
    canvas.height = height;

    gl.viewport(0, 0, width, height);

    gl.disable(gl.BLEND);
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.ONE, gl.ZERO);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(16384 | 256);

    const { at, to, angle } = renderer.camera;

    const x = at.x - width * to.x;
    const y = at.y - height * to.y;

    const multiply = (a, b) => {
      const a00 = a[0];
      const a11 = a[5];
      const a22 = a[10];
      const a30 = a[12];
      const a31 = a[13];
      const a32 = a[14];

      const b00 = b[0];
      const b01 = b[1];
      const b10 = b[4];
      const b11 = b[5];
      const b30 = b[12];
      const b31 = b[13];

      // prettier-ignore
      return [
        b00 * a00, b01 * a11, 0, 0,
        b10 * a00, b11 * a11, 0, 0,
        0, 0, a22, 0,
        b30 * a00 + a30, b31 * a11 + a31, a32, 1,
      ];
    };

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const ortho = orthographic(x, x + width, y + height, y, 65535, -65535);

    // prettier-ignore
    const rotation = [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,

      -at.x * c + -at.y * -s + at.x,
      -at.x * s + -at.y * c + at.y,
      0, 1,
    ];

    const projection = multiply(ortho, rotation);

    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);

    gl.uniformMatrix4fv(matrixLocation, false, projection);

    currentTexture = null;

    const transparents = new List();

    layers.forEach((l) => {
      l.l.iterate((sprite) => {
        if (sprite.alpha !== 1) {
          transparents.add(sprite);
        } else {
          draw(sprite);
        }
      });
    });

    flush();

    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // gl.depthFunc(gl.LEQUAL);
    gl.depthFunc(515);

    gl.uniform1f(alphaTestLocation, 1 / 256);

    transparents.iterate(sprite => draw(sprite));

    flush();
  };

  renderer.render();

  return renderer;
};

Renderer.Sprite = Sprite;

export default Renderer;
