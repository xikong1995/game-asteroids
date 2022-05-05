import { ImageLoadObj } from '../types';

/**
 * 加载图片资源
 *
 * @param items 图片加载对象
 * @param callback 所有图片加载完后的回调函数
 */
export function loadImages(items: ImageLoadObj[], callback: Function): void {
    let counter = 0;

    for (let i = 0; i < items.length; i++) {
        const { img, url } = items[i];
        img.src = url;
        img.onload = function () {
            counter++;
            if (counter >= items.length) {
                callback();
            }
        };
    }
}
