import Renderer from '../../dist/renderer.m';

const {
  Point, Texture, Frame, Sprite,
} = Renderer;

const stats = new Stats();
document.body.appendChild(stats.dom);

const view = document.getElementById('view');
const renderer = Renderer(view);
const { gl } = renderer;
// console.log(gl);

renderer.background(1, 1, 1);

renderer.camera.at.set(400, 300);
renderer.camera.to.set(0.5);

const atlasImg = () => {
  const canvas = document.createElement('canvas');
  const size = 32;
  const half = size / 2;
  canvas.width = 96;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  let offset = 0;

  ctx.lineWidth = size / 16;
  ctx.fillStyle = '#cccccc';
  ctx.strokeStyle = '#000000';
  ctx.beginPath();

  ctx.moveTo(offset + half, half);
  for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 5) {
    ctx.lineTo(offset + half - Math.sin(angle) * half * 0.9, half - Math.cos(angle) * half * 0.9);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  offset += size;

  ctx.beginPath();

  ctx.moveTo(offset + 3, 3);
  ctx.lineTo(offset + size - 3, 3);
  ctx.lineTo(offset + size - 3, size - 3);
  ctx.lineTo(offset + 3, size - 3);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  offset += size;

  ctx.beginPath();

  ctx.moveTo(offset + 3, 3);
  ctx.lineTo(offset + 29, 3);
  ctx.lineTo(offset + 29, 8);
  ctx.lineTo(offset + 8, 8);
  ctx.lineTo(offset + 8, 14);
  ctx.lineTo(offset + 20, 14);
  ctx.lineTo(offset + 20, 18);
  ctx.lineTo(offset + 8, 18);
  ctx.lineTo(offset + 8, 29);
  ctx.lineTo(offset + 3, 29);

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  return canvas;
};

const logoMask = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();

  ctx.moveTo(400, 300);
  for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / 5) {
    ctx.lineTo(400 - Math.sin(angle) * 250, 300 - Math.cos(angle) * 250);
  }

  ctx.closePath();
  ctx.fill();

  const { data } = ctx.getImageData(0, 0, 800, 600);

  return (x, y) => data[(y * 800 + x) * 4] > 0;
};

const atlas = Texture(renderer, atlasImg(), 0.5);
atlas.anchor = Point(0.5);

const bFrame = Frame(atlas, Point(), Point(32));
const qFrame = Frame(atlas, Point(32, 0), Point(32));
const fFrame = Frame(atlas, Point(64, 0), Point(32));

const frames = [atlas, bFrame, qFrame, fFrame];

let len = 0;

const sprs = [];

const mask = logoMask();

let cl = 0;

const addSprite = (a) => {
  if (len % 250 === 0) {
    cl++;
  }

  const layer = renderer.layer(cl);

  len += a;
  for (let i = 0; i < a; i++) {
    const sprite = Sprite(frames[i % 4]);

    let x = 0;
    let y = 0;

    while (!mask(x, y)) {
      x = ~~(800 * Math.random());
      y = ~~(600 * Math.random());
    }

    sprite.position.set(x, y);
    sprite.scale.set(0.5);
    sprite.tint = Math.random() * 0xffffff;
    sprite.rotation = Math.random() * Math.PI * 2;
    sprite.dr = (0.5 - Math.random()) * 0.1;
    sprite.trans = !Math.round(Math.random());
    sprs.push(sprite);
    layer.add(sprite);
  }
};

addSprite(1000);

const sprites = document.getElementById('info');

const dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');
const info = gl.getParameter(dbgRenderInfo ? dbgRenderInfo.UNMASKED_RENDERER_WEBGL : gl.VENDOR);

let add = false;

view.onmousedown = () => {
  add = true;
};
view.ontouchstart = () => {
  add = true;
};

view.onmouseup = () => {
  add = false;
};
view.ontouchend = () => {
  add = false;
};

const loop = () => {
  stats.begin();

  if (add) addSprite(25);

  sprites.innerHTML = `Renderer: ${info}</br>Sprites: ${len} (click to add)`;

  sprs.forEach((sprite) => {
    sprite.dr && (sprite.rotation += sprite.dr);
    if (sprite.trans && sprite.alpha > 0.6) {
      sprite.alpha -= 0.001;
    }
  });

  renderer.camera.angle += 0.005;

  renderer.render();
  stats.end();

  requestAnimationFrame(loop);
};

loop();
