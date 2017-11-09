/**
 * CSS3 transition animation.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { Utils } from '../util/Utils';
import { Device } from '../util/Device';
import { TweenManager } from './TweenManager';

class CSSTransition {

    constructor(object, props, time, ease, delay, callback) {
        let self = this;
        let transform = TweenManager.getAllTransforms(object),
            properties = [];

        initProperties();
        initCSSTween();

        function killed() {
            return !self || self.kill || !object || !object.element;
        }

        function initProperties() {
            for (let key in props) {
                if (TweenManager.checkTransform(key)) {
                    transform.use = true;
                    transform[key] = props[key];
                    delete props[key];
                } else {
                    if (typeof props[key] === 'number' || ~key.indexOf('-')) properties.push(key);
                }
            }
            if (transform.use) properties.push(Device.transformProperty);
            delete transform.use;
        }

        function initCSSTween() {
            if (killed()) return;
            if (object.cssTween) object.cssTween.kill = true;
            object.cssTween = self;
            let transition = '';
            for (let i = 0; i < properties.length; i++) transition += (transition.length ? ', ' : '') + properties[i] + ' ' + time + 'ms ' + TweenManager.getEase(ease) + ' ' + delay + 'ms';
            Delayed(() => {
                if (killed()) return;
                object.element.style[Device.vendor('Transition')] = transition;
                object.css(props);
                object.transform(transform);
                Delayed(() => {
                    if (killed()) return;
                    clear();
                    if (callback) callback();
                }, time + delay);
            }, 50);
        }

        function clear() {
            if (killed()) return;
            self.kill = true;
            object.element.style[Device.vendor('Transition')] = '';
            object.cssTween = null;
            Utils.nullObject(self);
        }

        this.stop = () => clear();
    }
}

export { CSSTransition };
