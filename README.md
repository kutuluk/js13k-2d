> ![logo](https://raw.githubusercontent.com/kutuluk/js13k-2d/master/logo.jpg 'logo')
>
> A 2kb webgl 2d sprite renderer, designed for [Js13kGames](http://js13kgames.com).

[![NPM version](https://img.shields.io/npm/v/js13k-2d.svg?style=flat-square)](https://www.npmjs.com/package/js13k-2d)

-   **Tiny:** weighs about 2 kilobyte gzipped
-   **Extremely fast:** tens of thousands sprites onscreen at 60 fps

## Demo

[Live examples](https://kutuluk.github.io/js13k-2d)

## Install

```sh
$ npm install js13k-2d
```

Then with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.js.org/), use as you would anything else:

```javascript
// using ES6 modules
import Renderer from 'js13k-2d';

// using CommonJS modules
var Renderer = require('js13k-2d');
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/js13k-2d/dist/renderer.umd.js"></script>
```

You can find the library on `window.Renderer`.

## Usage

```javascript
// Import the library
import Renderer from 'js13k-2d';

// Extract classes
const { Point, Sprite } = Renderer;

// Get canvas element, where the scene will be rendered to.
const view = document.getElementById('view');

// Create a scene
const scene = Renderer(view);

// Set background color
scene.background(1, 1, 1);

// Create a texture
const atlas = scene.texture(image);

// Create a frame
const frame = atlas.frame(Point(), Point(32));

// Create a sprite
const sprite = Sprite(frame);

// Add a sprite to the scene
scene.add(sprite);

const loop = () => {
    // Get the actual canvas size
    scene.resize();
    const { width, height } = view; // or scene.gl.canvas

    // Change sprite position
    sprite.position.set(Math.random() * width, Math.random() * height);

    // Render a scene
    scene.render();

    requestAnimationFrame(loop);
};

loop();
```

> For a better understanding of how to use the library, read along or see example folder and have a look at the [live examples](https://kutuluk.github.io/js13k-2d).

## API (in progress)

**This library is under development and should be considered as an unstable. There are no guarantees regarding API stability until the release 1.0.**

## Renderer.Point

The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis. The class provides the most minimal functionality.

### `new Renderer.Point(x, y)`

Creates a point with a `x` and `y` position. If `y` is omitted, both `x` and `y` will be set to `x` (0 by default). The presence of the keyword `new` is optional, so it is recommended to omit it for size reduction.

##### Properties

#### `x: number`

Position of the point on the x axis.

#### `y: number`

Position of the point on the y axis.

##### Methods

### `set(x, y): this`

Sets the point to a new `x` and `y` position. If `y` is omitted, both `x` and `y` will be set to `x` (0 by default).

##### Tips

For a smaller size reduction, you can use this class as the base for your vector class:

```javascript
class Vector extends Renderer.Point {
    clone() {
        return new Vector(this.x, this.y);
    }

    copy(vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    cross(vec) {
        return this.x * vec.y - this.y * vec.x;
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    // etc...
}
```

And even override Renderer.Point. **Note**: you need to do this before calling Renderer.

```javascript
Renderer.Point = Vector;

// then
const view = document.getElementById('view');
const scene = Renderer(view);

console.log(new Renderer.Point() instanceof Vector); // true
console.log(scene.camera.at instanceof Vector); // true
console.log(Renderer.Sprite(frame).position instanceof Vector); // true
// etc
```

## Renderer(canvas, options)

Returns an Renderer instance.

##### Parameters

-   `canvas` - The element where the scene will be rendered to. The provided element has to be `<canvas>` otherwise it won't work.
-   `options`:

-   `scale : number` - The resolution multiplier by which the scene is rendered relative to the canvas' resolution. Use `window.devicePixelRatio` for the highest possible quality, `1` for the best performance. Default `1`.
-   `alpha : boolean` - Default `false`.
-   `antialias : boolean` - Default `false`.

See [WebGL context attributes](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/getContext). Note that the default values ​​for `alpha` and `antialias` are overridden to `false`.

##### Properties

#### `gl: WebGLRenderingContext`

[MDN](https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext)

#### `camera`

The object that defines the camera. Has the following properties:

-   `at: Renderer.Point` - The position that the camera is looking at.
-   `to: Renderer.Point` - The position on the screen in which the point the camera is looking at is displayed. Values ​​from 0 to 1.
-   `angle: number` - The angle in radians on which the camera is rotated.

##### Methods

#### `background(r, g, b, a)`

Sets the background color. Values ​​from 0 to 1.

#### `texture(source, alphaTest, smooth, mipmap)`

Creates a texture object that stores the information that represents an image.

##### Parameters

-   `source` - the image or the canvas
-   `alphaTest: number` - the value of the alpha component of the texture pixel below which the pixel is considered completely transparent and is not displayed. The pixels with the alpha component equal to or greater than the alphaTest are displayed opaque. When the alphaTest value is 0, the texture is displayed in blend mode.
-   `smooth: boolean` - smooth texture
-   `mipmap: boolean` - generate mipmap for texture

Together, `smooth` and `mipmap` are provided with 4 modes of [texParameter](https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext/texParameter): `NEAREST`, `LINEAR`, `NEAREST_MIPMAP_LINEAR` and `LINEAR_MIPMAP_LINEAR`. **Note:** if `mipmap` is set to true, then the width and height of the `source` must be a power of 2.

The Texture object cannot be added to the display list directly. Instead use it as the texture for a Sprite and Frame. You can directly create a texture from an image and then reuse it multiple times like this:

```javascript
const { Point, Sprite } = Renderer;

const scene = Renderer(view);

const texture = scene.texture(image);

const sprite1 = Sprite(texture);
sprite1.position.set(100, 100);

const sprite2 = Sprite(texture, {
    position: Point(100, 200),
});

scene.add(sprite1);
scene.add(sprite2);

scene.render();
```

##### Texture properties

#### `texture.anchor: Renderer.Point`

The anchor sets the origin point of the texture. The default is `{0,0}` this means the texture's origin is the top left. Setting the anchor to `{0.5,0.5}` means the texture's origin is centered. Setting the anchor to `{1,1}` would mean the texture's origin point will be the bottom right corner. It's also the pivot point of the sprite that it rotates around.

#### `texture.size: Renderer.Point`

Determines the size of the texture in pixels with sprite.scale equal to (1, 1). When creating a texture, its size is set equal to the size of the source.

##### Texture methods

#### `texture.frame(origin, size, anchor)`

Creates a Frame object that stores the information that represents part of an image.

##### Parameters

-   `origin: Renderer.Point` - the coordinates of the upper left edge of the frame
-   `size: Renderer.Point` - the size of the frame
-   `anchor: Renderer.Point` - the anchor of the frame. If anchor not present, the anchor of texture will be used.

The Frame object cannot be added to the display list directly. Instead use it as the texture for a Sprite. The Frame has the same set of properties as the texture.

Example:

```javascript
const { Point, Sprite } = Renderer;

const scene = Renderer(view);

const atlas = scene.texture(image);

const frame1 = atlas.frame(Point(), Point(32));
const frame2 = atlas.frame(Point(32, 0), Point(32));

const sprite1 = Sprite(frame1);
sprite1.position.set(100, 100);

const sprite2 = Sprite(frame2, {
    position: Point(100, 200),
});

scene.add(sprite1);
scene.add(sprite2);

scene.render();
```

#### `layer(z)`

Gets or creates a layer from the given `z`.

#### `add(sprite)`

Adds a sprite to the layer with `z` equal to 0.

#### `resize()`

Makes inner canvas size equal to the displayed size of the canvas. Returns `true` if the change was made and `false` otherwise. This method is called inside render automatically. Directly it needs to be called only if it is necessary to get the actual canvas size before render or to determine the fact of changing the size of the canvas.

#### `render()`

Displays all the sprites with the visible field set to true.

## Renderer.Layer

##### Properties

#### `z: number`

Z-index of the layer. The larger, the higher the layer is.

##### Methods

#### `add(sprite)`

Adds the sprite to the layer. If the sprite is already present in another layer, it will be removed from it.

## Renderer.Sprite

The Sprite object is the textured objects that are rendered to the screen.

### `new Renderer.Sprite(frame, props)`

Creates a sprite from the frame with the specified properties. The presence of the keyword `new` is optional, so it is recommended to omit it for size reduction.

##### Properties

#### `frame: frame or texture`

#### `alpha: number`

The opacity of the sprite.

#### `position: Renderer.Point`

The coordinates of the sprite.

#### `rotation: number`

The rotation of the sprite in radians.

#### `scale: Renderer.Point`

The scale factor of the sprite.

#### `tint: number`

The tint applied to the sprite. This is a hex value. A value of `0xffffff` will remove any tint effect.

#### `visible: boolean`

The visibility of the sprite.

##### Methods

### `remove()`

Removes the sprite from the scene.
