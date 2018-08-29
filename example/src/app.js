import Renderer from '../../dist/renderer.m';

const stats = new Stats();
document.body.appendChild(stats.dom);
const view = document.getElementById('view');
const renderer = Renderer(view);
const { gl } = renderer;
// console.log(gl);

renderer.bkg(0.2, 0.2, 0.2, 1);

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

const atlasTex = renderer.texture(atlasImg());

const bBitmap = renderer.bitmap(atlasTex, 0, 0, 31, 31);
const qBitmap = renderer.bitmap(atlasTex, 32, 0, 63, 31);
const fBitmap = renderer.bitmap(atlasTex, 64, 0, 95, 31);

const bitmaps = [atlasTex, bBitmap, qBitmap, fBitmap];

let len = 0;

const sprs = [];

const addSprite = (l, a) => {
  len += a;
  for (let i = 0; i < a; i++) {
    const s = new Renderer.Sprite(bitmaps[i % 4]);
    s.position = {
      x: view.width * 0.1 + Math.random() * view.width * 0.8,
      y: view.height * 0.1 + Math.random() * view.height * 0.8,
    };
    s.scale = { x: 0.5, y: 0.5 };
    s.anchor = { x: 0.5, y: 0.5 };
    s.alpha = 0.7;
    s.tint = Math.random() * 0xffffff;
    s.rotation = Math.random() * Math.PI * 2;
    s.dr = (0.5 - Math.random()) * 0.2;
    sprs.push(s);
    l.add(s);
  }
};

addSprite(renderer.layer(0), 300);

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

  sprites.innerHTML = `Renderer: ${info}</br>Sprites: ${len}`;

  sprs.forEach((sprite) => {
    sprite.dr && (sprite.rotation += sprite.dr);
  });

  renderer.render();
  stats.end();

  requestAnimationFrame(loop);
};

loop();
