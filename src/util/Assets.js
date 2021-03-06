/**
 * Assets helper class with image promise method.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

class Assets {

    static init() {
        const images = {},
            json = {};

        this.CDN = '';
        this.CORS = null;

        this.getPath = path => {
            if (~path.indexOf('//')) return path;
            if (this.CDN && !~path.indexOf(this.CDN)) path = this.CDN + path;
            return path;
        };

        this.createImage = (path, store, callback) => {
            if (typeof store !== 'boolean') {
                callback = store;
                store = null;
            }
            const img = new Image();
            img.crossOrigin = this.CORS;
            img.onload = callback;
            img.onerror = callback;
            img.src = this.getPath(path);
            if (store) images[path] = img;
            return img;
        };

        this.getImage = path => {
            return images[path];
        };

        this.storeData = (name, data) => {
            json[name] = data;
            return json[name];
        };

        this.getData = name => {
            return json[name];
        };
    }

    static loadImage(img) {
        if (typeof img === 'string') img = this.createImage(img);
        const promise = Promise.create();
        img.onload = () => promise.resolve(img);
        img.onerror = () => promise.resolve(img);
        return promise;
    }
}

Assets.init();

export { Assets };
