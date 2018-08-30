# js13k-2d

> A 2kb 2d WebGL renderer, designed for [Js13kGames](http://js13kgames.com).

[![NPM version](https://img.shields.io/npm/v/js13k-2d.svg?style=flat-square)](https://www.npmjs.com/package/js13k-2d)[![Build Status](https://img.shields.io/travis/kutuluk/js13k-2d/master.svg?style=flat-square)](https://travis-ci.org/kutuluk/js13k-2d)

-   **Tiny:** weighs about 2 kilobyte gzipped

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

![demo](https://raw.githubusercontent.com/kutuluk/js13k-2d/master/demo.jpg 'demo')

See example folder. [Live example](https://kutuluk.github.io/js13k-2d).
