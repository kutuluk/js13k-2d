> ![logo](https://raw.githubusercontent.com/kutuluk/js13k-2d/master/logo.jpg 'logo')
>
> A 2kb 2d webgl renderer, designed for [Js13kGames](http://js13kgames.com).

[![NPM version](https://img.shields.io/npm/v/js13k-2d.svg?style=flat-square)](https://www.npmjs.com/package/js13k-2d)[![Build Status](https://img.shields.io/travis/kutuluk/js13k-2d/master.svg?style=flat-square)](https://travis-ci.org/kutuluk/js13k-2d)

-   **Tiny:** weighs about 2 kilobyte gzipped
-   **Extremely fast:** tens of thousands of sprites on the screen with a stable 60 FPS

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

### `Renderer.Point`

The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis. The class provides the minimum functionality. You can inherit from it and supplement it with the necessary vector methods:

```javascript
class Vector extends Renderer.Point {
    add(point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    cross(point) {
        return this.x * point.y - this.y * point.x;
    }

    dot(point) {
        return this.x * point.x + this.y * point.y;
    }

    // ...
}
```

#### `new Renderer.Point(x, y)`

`x` - position of the point on the x axis (default `0`)

`y` - position of the point on the y axis (default `0`)

#### `clone(): Renderer.Point`

Creates a clone of this point.

#### `copy(point): this`

Copies `x` and `y` from the given point.

#### `set(x, y): this`

Sets the point to a new `x` and `y` position. If `y` is omitted, both `x` and `y` will be set to `x` (default `0`).

### `Renderer.Sprite`

#### `new Renderer.Sprite(bitmap)`

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

#### `remove()`

Removes the sprite from the scene.
