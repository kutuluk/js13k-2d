import Renderer from '../../dist/renderer.m';

const { Texture, Bitmap, Sprite } = Renderer;

const stats = new Stats();
document.body.appendChild(stats.dom);

const view = document.getElementById('view');
const renderer = Renderer(view, { antialias: false });
const { gl } = renderer;
// console.log(gl);

renderer.bkg(0.2, 0.2, 0.2, 0);

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

const atlasTex = new Texture(renderer, atlasImg(), 0.5);

const bBitmap = new Bitmap(atlasTex, 0, 0, 32, 32);
const qBitmap = new Bitmap(atlasTex, 32, 0, 32, 32);
const fBitmap = new Bitmap(atlasTex, 64, 0, 32, 32);

const bitmaps = [atlasTex, bBitmap, qBitmap, fBitmap];

let len = 0;

const sprs = [];

const mask = logoMask();

const addSprite = (l, a) => {
  len += a;
  for (let i = 0; i < a; i++) {
    const sprite = new Sprite(bitmaps[i % 4]);

    let x = 0;
    let y = 0;

    while (!mask(x, y)) {
      x = ~~(800 * Math.random());
      y = ~~(600 * Math.random());
    }

    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    sprite.scale.set(0.5);
    // sprite.scale.set(2);
    // sprite.alpha = 0.8;
    sprite.tint = Math.random() * 0xffffff;
    sprite.rotation = Math.random() * Math.PI * 2;
    sprite.dr = (0.5 - Math.random()) * 0.1;
    sprs.push(sprite);
    l.add(sprite);
  }
};

addSprite(renderer.layer(0), 1000);

/*
const bitmapF = new Bitmap(atlasTex, 64, 0, 32, 32);
const bitmapFx = bitmapF.clone().flipX();
const bitmapFy = bitmapF.clone().flipY();
const bitmapFxy = bitmapFx.clone().flipY();

const spriteF = new Sprite(bitmapF);
spriteF.scale.set(3);
spriteF.position.set(100, 200);
renderer.layer(100).add(spriteF);

const spriteFx = new Sprite(bitmapFx);
spriteFx.scale.set(3);
spriteFx.position.set(200, 200);
renderer.layer(100).add(spriteFx);

const spriteFy = new Sprite(bitmapFy);
spriteFy.scale.set(3);
spriteFy.position.set(300, 200);
renderer.layer(100).add(spriteFy);

const spriteFxy = new Sprite(bitmapFxy);
spriteFxy.scale.set(3);
spriteFxy.position.set(400, 200);
renderer.layer(100).add(spriteFxy);
*/

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

/*
let stars = '';
fetch('https://api.github.com/repos/kutuluk/js13k-2d')
  .then(response => response.json())
  .then((json) => {
    stars = json.stargazers_count;
  });
*/

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
