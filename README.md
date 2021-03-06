# Alien.js
[![Build Status](https://travis-ci.org/pschroen/alien.js.svg)]()
[![Latest NPM release](https://img.shields.io/npm/v/alien.js.svg)]()
[![License](https://img.shields.io/npm/l/alien.js.svg)]()
[![Dependencies](https://img.shields.io/david/pschroen/alien.js.svg)]()
[![Dev Dependencies](https://img.shields.io/david/dev/pschroen/alien.js.svg)]()

Future web framework.

### Features

* ES6 modules [without transpiling](https://rawgit.com/pschroen/alien.js/master/examples/module/), or use [Rollup](https://rollupjs.org/) with [Tree Shaking](https://github.com/rollup/rollup#tree-shaking), only the classes you use are compiled into your project.
* Simple design pattern with inheritance, `Interface`, `Component`, etc.
* Event based or use promises.
* CSS3 animations.
* Math and Spring animations.
* Canvas graphics engine.
* Web audio engine.
* SVG support.
* WebGL with [three.js](https://threejs.org/).
* GLSL shaders with [glslify](https://github.com/glslify/glslify) (a node.js-style module system for GLSL).

### Examples

#### ui

[about](https://rawgit.com/pschroen/alien.js/master/examples/about/dist/)

#### shader

glslify [shader](https://rawgit.com/pschroen/alien.js/master/examples/shader/dist/)  
[colour beam](https://rawgit.com/pschroen/alien.js/master/examples/colour_beam/dist/)  
[dissolve](https://rawgit.com/pschroen/alien.js/master/examples/dissolve/dist/) (fade transition)  
[colorize](https://rawgit.com/pschroen/alien.js/master/examples/colorize/dist/) (fade transition)  
[chromatic aberration](https://rawgit.com/pschroen/alien.js/master/examples/chromatic_aberration/dist/) (simple)  
[chromatic aberration 2](https://rawgit.com/pschroen/alien.js/master/examples/chromatic_aberration2/dist/) (barrel distortion)  
[rotate](https://rawgit.com/pschroen/alien.js/master/examples/rotate/dist/)  
[rotate 2](https://rawgit.com/pschroen/alien.js/master/examples/rotate2/dist/) (pinhole)  
[mask](https://rawgit.com/pschroen/alien.js/master/examples/mask/dist/) (levels transition)  
[noise warp](https://rawgit.com/pschroen/alien.js/master/examples/noise_warp/dist/)  
[noise dizzy](https://rawgit.com/pschroen/alien.js/master/examples/noise_dizzy/dist/)  
[directional warp](https://rawgit.com/pschroen/alien.js/master/examples/directional_warp/dist/)  
[directional warp 2](https://rawgit.com/pschroen/alien.js/master/examples/directional_warp2/dist/) (scroll transition)  
[ripple](https://rawgit.com/pschroen/alien.js/master/examples/ripple/dist/)  
[perlin](https://rawgit.com/pschroen/alien.js/master/examples/perlin/dist/)  
[glitch displace](https://rawgit.com/pschroen/alien.js/master/examples/glitch_displace/dist/)  
[melt](https://rawgit.com/pschroen/alien.js/master/examples/melt/dist/) (feedback buffer)

### Example Class structure

```js
//
//  Class
//  │
//  ├── Decorators
//  └── Constructor
//      │
//      └── Private scope
//          │
//          ├── Constants
//          ├── Variables
//          ├── Functions
//          │
//          └── Public scope
//              │
//              ├── Methods
//              └── Overrides
//

class About extends Interface {

    constructor() {
        super('About');
        const self = this;

        // Private scope

        let wrapper;

        initHTML();
        addListeners();

        function initHTML() {
            self.size('100%');
            wrapper = self.create('.wrapper');
        }

        // Event listeners

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
        }

        // Public scope

        this.update = () => {
        };

        this.animateIn = callback => {
        };

        this.animateOut = callback => {
        };

        // Overrides

        this.destroy = () => {
            // ...
            return super.destroy();
        };
    }
}
```

### Example `Interface` design pattern

```js
import { Stage, Interface, Device } from '../alien.js/src/Alien.js';

Config.UI_OFFSET = Device.phone ? 20 : 35;

class Logo extends Interface {

    constructor() {
        super('Logo');
        const self = this;
        const size = Device.phone ? 40 : 64;

        initHTML();

        function initHTML() {
            self.size(size);
            self.css({
                left: Config.UI_OFFSET,
                top: Config.UI_OFFSET,
                opacity: 0
            });
            self.bg('assets/images/logo.svg', 'cover');
            self.tween({ opacity: 1 }, 1000, 'easeOutQuart');
            self.interact(hover, click);
        }

        function hover(e) {
            if (e.action === 'over') self.tween({ opacity: 0.7 }, 100, 'easeOutSine');
            else self.tween({ opacity: 1 }, 300, 'easeOutSine');
        }

        function click() {
            getURL('https://alien.js.org/');
        }
    }
}

class Main {

    constructor() {
        Stage.initClass(Logo);
    }
}

new Main();
```

### Example Singleton design pattern

```js
import { Events, Stage, Interface, Canvas } from '../alien.js/src/Alien.js';

class CanvasLayer extends Interface {

    static instance() {
        if (!this.singleton) this.singleton = new CanvasLayer();
        return this.singleton;
    }

    constructor() {
        super('CanvasLayer');
        const self = this;

        initContainer();
        initCanvas();
        addListeners();

        function initContainer() {
            self.size('100%').mouseEnabled(false);
            Stage.add(self);
        }

        function initCanvas() {
            self.canvas = self.initClass(Canvas, Stage.width, Stage.height, true);
        }

        function addListeners() {
            self.events.add(Events.RESIZE, resize);
            resize();
        }

        function resize() {
            self.canvas.size(Stage.width, Stage.height);
        }
    }
}

class Main {

    constructor() {
        let canvas;

        initCanvas();

        function initCanvas() {
            canvas = CanvasLayer.instance().canvas;
            // ...
        }
    }
}

new Main();
```

### Example Static Class design pattern

```js
import { Events, Stage, StateDispatcher } from '../alien.js/src/Alien.js';

class Data {

    static init() {
        const self = this;

        this.dispatcher = Stage.initClass(StateDispatcher, true);

        addListeners();

        function addListeners() {
            Stage.events.add(self.dispatcher, Events.UPDATE, stateChange);
        }

        function stateChange(e) {
            if (e.path !== '') self.setSlide(e);
        }

        this.setSlide = e => {
            // ...
        };
    }
}

class Main {

    constructor() {
        Data.init();

        const state = Data.dispatcher.getState();
        if (state.path !== '') {
            // ...
        }
    }
}

new Main();
```

### Quickstart

To build a project, make sure you have [Node.js](https://nodejs.org/) installed (at least version 6.9).

```
mkdir loader
cd loader
git init
git submodule add -b master https://github.com/pschroen/alien.js
cp -r alien.js/examples/loader/* .
cp alien.js/.eslintrc.json alien.js/.gitignore .
npm install
npm start
```

Then open [http://localhost:8080/](http://localhost:8080/). The `npm start` script runs `npm run dev`, so you can start experimenting with the code right away! :)

### Updating

```
git submodule update --remote --merge
cp alien.js/examples/loader/package.json alien.js/examples/loader/rollup.config.js .
cp alien.js/.eslintrc.json alien.js/.gitignore .
rm -rf node_modules package-lock.json
npm install
```

### Workflow

```
npm run lint
npm run build
npm start
npm run build
```

### Roadmap

* Docs
* Tests
* Import three.js via modules
* Dynamically import classes
* Particle examples
* FX and lighting
* Error handling

### Changelog

* [Releases](https://github.com/pschroen/alien.js/releases)

### Inspiration

* Active Theory's [GitHub](https://github.com/activetheory)
* Active Theory's [gists](https://gist.github.com/activetheory)
* Active Theory's [Mira](https://medium.com/@activetheory/mira-exploring-the-potential-of-the-future-web-e1f7f326d58e)
* [Active Theory](https://activetheory.net/)
* [ECMAScript modules in browsers](https://jakearchibald.com/2017/es-modules-in-browsers/)
* [How to Set Up Smaller, More Efficient JavaScript Bundling Using Rollup](https://code.lengstorf.com/learn-rollup-js/)

### Links

* [Website](https://alien.js.org/)

### License

Released under the [MIT license](LICENSE).
