import Renderer from '../../dist/renderer.m';

const stats = new Stats();
document.body.appendChild(stats.dom);
const view = document.getElementById('view');
const renderer = Renderer(view);
const { gl } = renderer;
// console.log(gl);

renderer.bkg(0.2, 0.2, 0.2, 0);
renderer.camera = {
  at: { x: 400, y: 300 },
  to: { x: 0.5, y: 0.5 },
  angle: 0,
};

const atlasImg = () => {
  const canvas = document.createElement('canvas');
  const size = 32;
  const half = size / 2;
  canvas.width = 96;
  canvas.height = 32;
  // const ctx = canvas.getContext('2d', { alpha: false });
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

const atlasTex = renderer.texture(atlasImg());
atlasTex.tex.alphaTest = 0.5;

const bBitmap = renderer.bitmap(atlasTex, 0, 0, 31, 31);
const qBitmap = renderer.bitmap(atlasTex, 32, 0, 63, 31);
const fBitmap = renderer.bitmap(atlasTex, 64, 0, 95, 31);

const bitmaps = [atlasTex, bBitmap, qBitmap, fBitmap];

let len = 0;

const sprs = [];

const mask = logoMask();

const addSprite = (l, a) => {
  len += a;
  for (let i = 0; i < a; i++) {
    const s = new Renderer.Sprite(bitmaps[i % 4]);

    let x = 0;
    let y = 0;

    while (!mask(x, y)) {
      x = ~~(view.width * Math.random());
      y = ~~(view.height * Math.random());
    }

    s.position = { x, y };
    s.scale = { x: 0.5, y: 0.5 };
    // s.alpha = 0.8;
    s.tint = Math.random() * 0xffffff;
    s.rotation = Math.random() * Math.PI * 2;
    s.dr = (0.5 - Math.random()) * 0.2;
    sprs.push(s);
    l.add(s);
  }
};

addSprite(renderer.layer(0), 1000);

const sprites = document.getElementById('info');

const dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info');
const info = gl.getParameter(dbgRenderInfo ? dbgRenderInfo.UNMASKED_RENDERER_WEBGL : gl.VENDOR);

let add = null;

let l = 1;
view.onmousedown = () => {
  add = renderer.layer(l++);
};
view.ontouchstart = () => {
  add = renderer.layer(l++);
};

view.onmouseup = () => {
  add = null;
};
view.ontouchend = () => {
  add = null;
};

const loop = () => {
  stats.begin();

  if (add) addSprite(add, 25);

  sprites.innerHTML = `Renderer: ${info}</br>Sprites: ${len} (click to add)`;

  sprs.forEach((sprite) => {
    sprite.dr && (sprite.rotation += sprite.dr);
  });

  renderer.camera.angle += 0.005;

  renderer.render();
  stats.end();

  requestAnimationFrame(loop);
};

loop();
