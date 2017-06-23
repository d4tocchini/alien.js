/**
 * Canvas font utilities.
 *
 * @author Patrick Schroen / https://github.com/pschroen
 */

import { CanvasGraphics } from './CanvasGraphics';

class CanvasFont {

    constructor() {

        function createText(canvas, width, height, str, font, fillStyle, letterSpacing, textAlign) {
            let context = canvas.context,
                graphics = canvas.initClass(CanvasGraphics, width, height);
            graphics.font = font;
            graphics.fillStyle = fillStyle;
            let chr,
                characters = str.split(''),
                index = 0,
                currentPosition = 0,
                totalWidth = 0;
            context.font = font;
            for (let i = 0; i < characters.length; i++) totalWidth += context.measureText(characters[i]).width + letterSpacing;
            switch (textAlign) {
            case 'start':
            case 'left':
                currentPosition = 0;
                break;
            case 'end':
            case 'right':
                currentPosition = width - totalWidth;
                break;
            case 'center':
                currentPosition = (width - totalWidth) / 2;
                break;
            }
            do {
                chr = characters[index++];
                graphics.fillText(chr, currentPosition, 0);
                currentPosition += context.measureText(chr).width + letterSpacing;
            } while (index < str.length);
            return graphics;
        }

        this.createText = (canvas, width, height, str, font, fillStyle, {letterSpacing = 0, lineHeight = height, textAlign = 'start'}) => {
            let context = canvas.context;
            if (height === lineHeight) {
                return createText(canvas, width, height, str, font, fillStyle, letterSpacing, textAlign);
            } else {
                let text = canvas.initClass(CanvasGraphics, width, height),
                    words = str.split(' '),
                    line = '',
                    lines = [];
                context.font = font;
                for (let n = 0; n < words.length; n++) {
                    let testLine = line + words[n] + ' ',
                        characters = testLine.split(''),
                        testWidth = 0;
                    for (let i = 0; i < characters.length; i++) testWidth += context.measureText(characters[i]).width + letterSpacing;
                    if (testWidth > width && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);
                lines.every((e, i) => {
                    let graphics = createText(canvas, width, lineHeight, e, font, fillStyle, letterSpacing, textAlign);
                    graphics.y = i * lineHeight;
                    text.add(graphics);
                    return true;
                });
                return text;
            }
        };
    }
}

export { CanvasFont };