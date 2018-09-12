> ![logo](https://raw.githubusercontent.com/kutuluk/js13k-2d/master/logo.jpg 'logo')
>
> A 2kb webgl 2d sprite renderer, designed for [Js13kGames](http://js13kgames.com).

[![NPM version](https://img.shields.io/npm/v/js13k-2d.svg?style=flat-square)](https://www.npmjs.com/package/js13k-2d)[![Build Status](https://img.shields.io/travis/kutuluk/js13k-2d/master.svg?style=flat-square)](https://travis-ci.org/kutuluk/js13k-2d)

-   **Tiny:** weighs about 2 kilobyte gzipped
-   **Extremely fast:** tens of thousands of sprites on the screen

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

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

See example folder. [Live example](https://kutuluk.github.io/js13k-2d).

## API (in progress)

**This library is under development and should be considered as an unstable. There are no guarantees regarding API stability until the release of version 1.0.**

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

### `clone(): Renderer.Point`

Creates a clone of this point.

##### Tips

For a smaller size reduction, you can use this class as the base for your vector class:

```javascript
class Vector extends Renderer.Point {
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
const renderer = Renderer(view);

console.log(new Renderer.Point() instanceof Vector); // true
console.log(renderer.camera.at instanceof Vector); // true
console.log(new Renderer.Sprite(frame).position instanceof Vector); // true
// etc
```

## Renderer(canvas, options)

Returns an Renderer instance.

##### Parameters

-   `canvas` - The element where the scene, with all of its instances, will be rendered to. The provided element has to be `<canvas>` otherwise it won't work.
-   `options` - [WebGL context attributes](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/getContext). Note that the default values ​​for `alpha` and `antialias` are overridden to `false`.

##### Properties

#### `gl: WebGLRenderingContext`

[MDN](https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext)

#### `camera`

The object that defines the camera. Has the following properties:

-   `at: Renderer.Point` - The position that the camera is looking at.
-   `to: Renderer.Point` - The position on the screen in which the point the camera is looking at is displayed. Values ​​from 0 to 1.
-   `angle: number` - The angle in radians on which the camera is rotated.

##### Methods

#### `background(r, g, b)`

Sets the background color. Values ​​from 0 to 1.

#### `layer(z)`

Gets or creates a layer from the given `z`.

#### `add(sprite)`

Adds a sprite to the layer with `z` equal to 0.

#### `render()`

Displays all the sprites with the visible field set to true.

## Renderer.Layer

##### Properties

#### `z: number`

Z-index of the layer. The larger, the higher the layer is.

##### Methods

#### `add(sprite)`

Adds a sprite to the layer.

## Renderer.Texture

The Texture object stores the information that represents an image. It cannot be added to the display list directly. Instead use it as the texture for a Sprite and Frame.

You can directly create a texture from an image and then reuse it multiple times like this:

```javascript
const renderer = Renderer(view);
const { Texture, Sprite } = Renderer;

const texture = new Texture(renderer, image);

const sprite1 = new Sprite(texture);
sprite1.position.set(100, 100);

const sprite2 = new Sprite(texture);
sprite2.position.set(200, 100);

renderer.add(sprite1);
renderer.add(sprite2);

renderer.render();
```

### `new Renderer.Texture(renderer, img, alphaTest, texParameters)`

Creates a texture for the renderer that you can use to create sprites or frames. The presence of the keyword `new` is optional, so it is recommended to omit it for size reduction.

##### Parameters

-   `renderer` - the Renderer instance
-   `img` - the image or the canvas
-   `alphaTest` - the value of the alpha component of the texture pixel below which the pixel is considered completely transparent and is not displayed. The pixels with the alpha component equal to or greater than the alphaTest are displayed opaque. When the alphaTest value is 0, the texture is displayed in blend mode.
-   `texParameters` -
    an object that defines the texture parameters according to [MDN](https://developer.mozilla.org/docs/Web/API/WebGLRenderingContext/texParameter), where the keys are `pname`, and the values are `param`.

##### Properties

#### `tex: number`

WebGL texture ID.

#### `anchor: Renderer.Point`

The anchor sets the origin point of the texture. The default is `{0,0}` this means the texture's origin is the top left. Setting the anchor to `{0.5,0.5}` means the texture's origin is centered. Setting the anchor to `{1,1}` would mean the texture's origin point will be the bottom right corner. It's also the pivot point of the sprite that it rotates around.

#### `alphaTest: number` (read only)

The alphaTest of texture.

#### `width: number`

The width of texture.

#### `height: number`

The height of texture.

## Renderer.Frame

The Frame object stores the information that represents part of an image. It cannot be added to the display list directly. Instead use it as the texture for a Sprite.

You can directly create a frame from an texture and then reuse it multiple times like this:

```javascript
const renderer = Renderer(view);
const { Point, Texture, Frame, Sprite } = Renderer;

const texture = new Texture(renderer, image);

const frame1 = new Frame(texture, Point(), Point(32));
const frame2 = new Frame(texture, Point(32, 0), Point(32));
const frame3 = new Frame(texture, Point(64, 0), Point(32));
const frame4 = new Frame(texture, Point(96, 0), Point(32));

const sprite1 = new Sprite(frame1);
sprite1.position.set(100, 100);

const sprite2 = new Sprite(frame2);
sprite2.position.set(150, 100);

const sprite3 = new Sprite(frame3);
sprite3.position.set(200, 100);

const sprite4 = new Sprite(frame4);
sprite4.position.set(250, 100);

renderer.add(sprite1);
renderer.add(sprite2);
renderer.add(sprite3);
renderer.add(sprite4);

renderer.render();
```

### `new Renderer.Frame(texture, origin, size, anchor)`

Creates a frame that you can use to create sprites. The presence of the keyword `new` is optional, so it is recommended to omit it for size reduction.

##### Parameters

-   `texture: Renderer.Texture` - the texture for the frame
-   `origin: Renderer.Point` - the coordinates of the upper left edge of the frame
-   `size: Renderer.Point` - the size of the frame
-   `anchor: Renderer.Point` - the anchor of the frame. If not presented, then the texture ahchor is cloned.

##### Properties

#### `tex: number` (read only)

WebGL texture ID.

#### `anchor: Renderer.Point`

See `Renderer.Texture.anchor`.

#### `alphaTest: number` (read only)

See `Renderer.Texture.alphaTest`.

#### `width: number`

See `Renderer.Texture.width`.

#### `height: number`

See `Renderer.Texture.height`.

## Renderer.Sprite

The Sprite object is the textured objects that are rendered to the screen.

### `new Renderer.Sprite(frame, props)`

Creates a sprite from the frame with the specified properties. The presence of the keyword `new` is optional, so it is recommended to omit it for size reduction.

##### Properties

#### `frame: Renderer.Texture | Renderer.Frame`

#### `alpha: number`

The opacity of the sprite.

#### `position: Renderer.Point`

The coordinate of the sprite.

#### `rotation: number`

The rotation of the sprite in radians.

#### `scale: Renderer.Point`

The scale factor of the sprite.

#### `anchor: Renderer.Point`

The anchor of sprite. If not specified, the anchor of the frame is used.

#### `tint: number`

The tint applied to the sprite. This is a hex value. A value of `0xffffff` will remove any tint effect.

#### `visible: boolean`

The visibility of the sprite.

##### Methods

### `remove()`

Removes the sprite from the scene.
