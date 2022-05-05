import { Base } from './base';
import { DrawImage } from './drawimage';

/**
 * 游戏背景
 */
export class Background extends Base {
    constructor(drawImg: DrawImage) {
        super();

        this.drawImg = drawImg;
        this.sx = drawImg.sx;
        this.sy = drawImg.sy;
    }

    update() {
        this.sx += 0.5;
        if (this.sx >= 1200) {
            this.sx = 0;
        }
    }

    render(context) {
        context.save();
        context.drawImage(
            this.drawImg.img,
            this.sx,
            this.sy,
            this.drawImg.width,
            this.drawImg.height,
            0,
            0,
            this.drawImg.width,
            this.drawImg.height,
        );
        context.restore();
    }
}
