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

The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis. The class provides the minimum functionality.

### `new Renderer.Point(x, y)`

Creates a point with a `x` and `y` position. If `y` is omitted, both `x` and `y` will be set to `x` (0 by default).

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
    copy(vec) {
        return this.set(vec.x, vec.y);
    }

    clone() {
        return new Vector(this.x, this.y);
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

console.log(renderer.camera.at instanceof Vector); // true
console.log(new Renderer.Point() instanceof Vector); // true
console.log(new Renderer.Sprite(bitmap).position instanceof Vector); // true
// etc
```

## Renderer.Texture

The Texture object stores the information that represents an image. It cannot be added to the display list directly. Instead use it as the texture for a Sprite and Bitmap.

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

Creates a texture for the renderer that you can use to create sprites or bitmaps.

##### Properties

#### `tex: number`

WebGL texture ID.

#### `alphaTest: number`

#### `width: number`

#### `height: number`

##### Methods

### `flipX(): this`

### `flipY(): this`

## Renderer.Bitmap

The Texture object stores the information that represents part of an image. It cannot be added to the display list directly. Instead use it as the texture for a Sprite.

You can directly create a bitmap from an texrure and then reuse it multiple times like this:

```javascript
const renderer = Renderer(view);
const { Texture, Bitmap, Sprite } = Renderer;

const texture = new Texture(renderer, image);

const bitmap1 = new Bitmap(texture, 0, 0, 32, 32);
const bitmap2 = bitmap1.clone().flipX();
const bitmap3 = bitmap2.clone().flipY();
const bitmap4 = bitmap3.clone().flipX();

const sprite1 = new Sprite(bitmap1);
sprite1.position.set(100, 100);

const sprite2 = new Sprite(bitmap2);
sprite2.position.set(200, 100);

const sprite3 = new Sprite(bitmap3);
sprite3.position.set(200, 200);

const sprite4 = new Sprite(bitmap4);
sprite4.position.set(100, 200);

renderer.add(sprite1);
renderer.add(sprite2);
renderer.add(sprite3);
renderer.add(sprite4);

renderer.render();
```

### `new Renderer.Bitmap(texture, left, top, width, height)`

Creates a bitmap that you can use to create sprites.

##### Properties

#### `tex: number` (read only)

WebGL texture ID.

#### `alphaTest: number` (read only)

#### `width: number`

#### `height: number`

##### Methods

### `flipX(): this`

### `flipY(): this`

### `clone(): Renderer.Bitmap`

## Renderer.Sprite

### `new Renderer.Sprite(bitmap)`

##### Properties

#### `alpha: number`

The opacity of the sprite.

#### `position: Renderer.Point`

The coordinate of the sprite.

#### `rotation: number`

The rotation of the sprite in radians.

#### `scale: Renderer.Point`

The scale factor of the sprite.

#### `tint: number`

The tint applied to the sprite. This is a hex value. A value of `0xffffff` will remove any tint effect.

#### `visible: boolean`

The visibility of the sprite.

#### `anchor: Renderer.Point`

The anchor sets the origin point of the texture. The default is `{0,0}` this means the texture's origin is the top left. Setting the anchor to `{0.5,0.5}` means the texture's origin is centered. Setting the anchor to `{1,1}` would mean the texture's origin point will be the bottom right corner. It's also the pivot point of the sprite that it rotates around.

##### Methods

### `remove()`

Removes the sprite from the scene.
