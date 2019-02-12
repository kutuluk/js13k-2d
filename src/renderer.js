import List from './list';

// const DEVELOPMENT = process.env.NODE_ENV === 'development';

const GL_VERTEX_SHADER = 35633;
const GL_FRAGMENT_SHADER = 35632;
const GL_ARRAY_BUFFER = 34962;
const GL_ELEMENT_ARRAY_BUFFER = 34963;
const GL_STATIC_DRAW = 35044;
const GL_DYNAMI_CDRAW = 35048;
const GL_RGBA = 6408;
const GL_UNSIGNED_BYTE = 5121;
const GL_FLOAT = 5126;
const GL_TRIANGLES = 4;
const GL_DEPTH_TEST = 2929;
const GL_LESS = 513;
const GL_LEQUAL = 515;
const GL_BLEND = 3042;
const GL_ZERO = 0;
const GL_ONE = 1;
const GL_SRC_ALPHA = 770;
const GL_ONE_MINUS_SRC_ALPHA = 771;
const GL_COLOR_BUFFER_BIT = 16384;
const GL_DEPTH_BUFFER_BIT = 256;
const GL_TEXTURE_2D = 3553;
const GL_NEAREST = 9728;
const GL_TEXTURE_MAG_FILTER = 10240;
const GL_TEXTURE_MIN_FILTER = 10241;

const vertexShader = `attribute vec2 g;
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

const fragmentShader = `precision mediump float;
uniform sampler2D x;
uniform float j;
varying vec2 v;
varying vec4 i;
void main(){
vec4 c=texture2D(x,v);
gl_FragColor=c*i;
if(j>0.0){
if(c.a<j)discard;
gl_FragColor.a=1.0;};}`;

const maxBatch = 65535;
const depth = 1e5;
const nullFrame = { p: { t: 0 } };

class Layer {
  constructor(z) {
    /*
    if (DEVELOPMENT) {
      if (!z && z !== 0) {
        throw new Error('A z parameter is required');
      }
    }
    */

    this.z = z;
    this.o = new List();
    this.t = new List();
  }

  add(sprite) {
    sprite.remove();
    sprite.l = this;
    sprite.n = ((sprite.a !== 1 || sprite.frame.p.a === 0) ? this.t : this.o).add(sprite);
  }
}

const Renderer = (canvas, options) => {
  const zeroLayer = new Layer(0);
  const layers = [zeroLayer];

  const floatSize = 2 + 2 + 1 + 2 + 4 + 1 + 1;
  const byteSize = floatSize * 4;
  const arrayBuffer = new ArrayBuffer(maxBatch * byteSize);
  const floatView = new Float32Array(arrayBuffer);
  const uintView = new Uint32Array(arrayBuffer);

  const { Point } = Renderer;

  const opts = Object.assign({ antialias: false, alpha: false }, options);
  const blend = opts.alpha ? GL_ONE : GL_SRC_ALPHA;
  const scale = opts.scale || 1;
  delete opts.scale;

  const gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webg', opts);

  /*
  if (DEVELOPMENT) {
    if (!gl) {
      throw new Error('WebGL not found');
    }
  }
  */

  const ext = gl.getExtension('ANGLE_instanced_arrays');

  /*
  if (DEVELOPMENT) {
    if (!ext) {
      throw new Error('Requared ANGLE_instanced_arrays extension not found');
    }
  }
  */

  const compileShader = (source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    /*
    if (DEVELOPMENT) {
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(error);
      }
    }
    */

    return shader;
  };

  const program = gl.createProgram();
  gl.attachShader(program, compileShader(vertexShader, GL_VERTEX_SHADER));
  gl.attachShader(program, compileShader(fragmentShader, GL_FRAGMENT_SHADER));
  gl.linkProgram(program);

  /*
  if (DEVELOPMENT) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(error);
    }
  }
  */

  const createBuffer = (type, src, usage) => {
    gl.bindBuffer(type, gl.createBuffer());
    gl.bufferData(type, src, usage || GL_STATIC_DRAW);
  };

  const bindAttrib = (name, size, stride, divisor, offset, type, norm) => {
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, type || GL_FLOAT, !!norm, stride || 0, offset || 0);
    divisor && ext.vertexAttribDivisorANGLE(location, divisor);
  };

  // indicesBuffer
  createBuffer(GL_ELEMENT_ARRAY_BUFFER, new Uint8Array([0, 1, 2, 2, 1, 3]));

  // vertexBuffer
  createBuffer(GL_ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]));

  // vertexLocation
  bindAttrib('g', 2);

  // dynamicBuffer
  createBuffer(GL_ARRAY_BUFFER, arrayBuffer, GL_DYNAMI_CDRAW);

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
  bindAttrib('c', 4, byteSize, 1, 44, GL_UNSIGNED_BYTE, true);
  // zLocation
  bindAttrib('z', 1, byteSize, 1, 48);

  const getUniformLocation = name => gl.getUniformLocation(program, name);
  const matrixLocation = getUniformLocation('m');
  const textureLocation = getUniformLocation('x');
  const alphaTestLocation = getUniformLocation('j');

  let width;
  let height;

  let count = 0;
  let currentFrame;
  let alphaTestMode;

  const resize = () => {
    width = canvas.clientWidth * scale | 0;
    height = canvas.clientHeight * scale | 0;

    const change = canvas.width !== width || canvas.height !== height;

    canvas.width = width;
    canvas.height = height;

    return change;
  };

  const flush = () => {
    if (!count) return;

    /*
    if (alphaTestMode) {
      gl.disable(GL_BLEND);
    } else {
      gl.enable(GL_BLEND);
      gl.blendFunc(blend, GL_ONE_MINUS_SRC_ALPHA);
    }
    */

    gl.blendFunc(alphaTestMode ? GL_ONE : blend, alphaTestMode ? GL_ZERO : GL_ONE_MINUS_SRC_ALPHA);
    gl.depthFunc(alphaTestMode ? GL_LESS : GL_LEQUAL);

    gl.bindTexture(GL_TEXTURE_2D, currentFrame.p.t);
    gl.uniform1i(textureLocation, currentFrame.p.t);
    gl.uniform1f(alphaTestLocation, alphaTestMode ? currentFrame.p.a : 0);

    gl.bufferSubData(GL_ARRAY_BUFFER, 0, floatView.subarray(0, count * floatSize));
    ext.drawElementsInstancedANGLE(GL_TRIANGLES, 6, GL_UNSIGNED_BYTE, 0, count);
    count = 0;
  };

  const draw = (sprite) => {
    if (!sprite.visible) return;

    if (count === maxBatch) flush();

    const { frame } = sprite;
    const { uvs } = frame;

    if (currentFrame.p.t !== frame.p.t) {
      currentFrame.p.t && flush();
      currentFrame = frame;
    }

    let i = count * floatSize;

    floatView[i++] = frame.anchor.x;
    floatView[i++] = frame.anchor.y;

    floatView[i++] = sprite.scale.x * frame.size.x;
    floatView[i++] = sprite.scale.y * frame.size.y;

    floatView[i++] = sprite.rotation;

    floatView[i++] = sprite.position.x;
    floatView[i++] = sprite.position.y;

    /* eslint-disable prefer-destructuring */
    floatView[i++] = uvs[0];
    floatView[i++] = uvs[1];
    floatView[i++] = uvs[2];
    floatView[i++] = uvs[3];
    /* eslint-enable prefer-destructuring */

    uintView[i++] = (((sprite.tint & 0xffffff) << 8) | ((sprite.a * 255) & 255)) >>> 0;
    floatView[i] = sprite.l.z;

    count++;
  };

  const renderer = {
    gl,

    camera: {
      at: Point(),
      to: Point(), // 0 -> 1
      angle: 0,
    },

    background(r, g, b, a) {
      gl.clearColor(r, g, b, a === 0 ? 0 : (a || 1));
    },

    layer(z) {
      let l = layers.find(layer => layer.z === z);

      if (!l) {
        l = new Layer(z);
        layers.push(l);
        layers.sort((a, b) => b.z - a.z);
      }

      return l;
    },

    add(sprite) {
      zeroLayer.add(sprite);
    },

    texture(source, alphaTest, smooth, mipmap) {
      const srcWidth = source.width;
      const srcHeight = source.height;
      const t = gl.createTexture();

      gl.bindTexture(GL_TEXTURE_2D, t);
      // NEAREST || LINEAR
      gl.texParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST | +smooth);
      // NEAREST || LINEAR || NEAREST_MIPMAP_LINEAR || LINEAR_MIPMAP_LINEAR
      gl.texParameteri(
        GL_TEXTURE_2D,
        GL_TEXTURE_MIN_FILTER,
        GL_NEAREST | +smooth | (+mipmap << 8) | (+mipmap << 1),
      );
      gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, GL_RGBA, GL_UNSIGNED_BYTE, source);
      mipmap && gl.generateMipmap(GL_TEXTURE_2D);

      return {
        size: Point(srcWidth, srcHeight),
        anchor: Point(),
        uvs: [0, 0, 1, 1],
        p: {
          a: alphaTest === 0 ? 0 : (alphaTest || 1),
          t,
        },
        frame(origin, size, anchor) {
          return {
            size,
            anchor: anchor || this.anchor,
            uvs: [
              origin.x / srcWidth,
              origin.y / srcHeight,
              size.x / srcWidth,
              size.y / srcHeight,
            ],
            p: this.p,
          };
        },
      };
    },

    resize,

    render() {
      resize();

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

      |     2/width|           0|        0| 0|
      |           0|   -2/height|        0| 0|
      |           0|           0| -1/depth| 0|
      | -2x/width-1| 2y/height+1|        0| 1|

      */

      // prettier-ignore
      const projection = [
        c * w, s * h, 0, 0,
        -s * w, c * h, 0, 0,
        0, 0, -1 / depth, 0,

        (at.x * (1 - c) + at.y * s) * w - 2 * x / width - 1,
        (at.y * (1 - c) - at.x * s) * h + 2 * y / height + 1,
        0, 1,
      ];

      gl.useProgram(program);
      gl.enable(GL_BLEND);
      gl.enable(GL_DEPTH_TEST);

      gl.uniformMatrix4fv(matrixLocation, false, projection);
      gl.viewport(0, 0, width, height);
      gl.clear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

      currentFrame = nullFrame;

      alphaTestMode = true;
      layers.forEach(layer => layer.o.i(draw));
      flush();

      alphaTestMode = false;
      for (let l = layers.length - 1; l >= 0; l--) {
        layers[l].t.i(draw);
      }
      flush();
    },
  };

  resize();

  return renderer;
};

Renderer.Point = class Point {
  constructor(x, y) {
    if (!(this instanceof Renderer.Point)) {
      return new Renderer.Point(x, y);
    }
    this.set(x, y);
  }

  set(x, y) {
    this.x = x || 0;
    this.y = y || (y !== 0 ? this.x : 0);
    return this;
  }
};

Renderer.Sprite = class Sprite {
  constructor(frame, props) {
    /*
    if (DEVELOPMENT) {
      if (!frame) {
        throw new Error('A frame parameter is required');
      }
    }
    */

    if (!(this instanceof Sprite)) {
      return new Sprite(frame, props);
    }

    Object.assign(
      this,
      {
        frame,
        visible: true,
        position: Renderer.Point(),
        rotation: 0,
        scale: Renderer.Point(1),
        tint: 0xffffff,
        a: 1,
        l: null,
        n: null,
      },
      props,
    );
  }

  get alpha() {
    return this.a;
  }

  set alpha(value) {
    /*
    if (DEVELOPMENT) {
      if (!value || value < 0 || value > 1) {
        throw new Error('An alpha of a sprite should be in the range from 0 to 1.');
      }
    }
    */

    const change = (value < 1 && this.a === 1) || (value === 1 && this.a < 1);
    this.a = value;
    change && this.frame.p.a > 0 && this.l && this.l.add(this);
  }

  remove() {
    this.n && this.n.r();
    this.l = null;
    this.n = null;
  }
};

export default Renderer;
