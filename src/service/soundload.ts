import { SoundsObj } from '../types';

/**
 * 声音加载服务
 *
 * 加载游戏各种声音
 */
export class SoundLoad {
    audioContext: AudioContext | null;

    sounds: SoundsObj = {};

    audioGain: any;

    audioComp: any;

    constructor() {
        this.audioContext =
            typeof AudioContext === 'function' ? new AudioContext() : null;
        if (this.audioContext) {
            this.audioGain = this.audioContext.createGain();
            this.audioGain.gain.value = 0.05;
            this.audioComp = this.audioContext.createDynamicsCompressor();
            this.audioGain.connect(this.audioComp);
            this.audioComp.connect(this.audioContext.destination);
        }
    }

    hasAudio() {
        return this.audioContext !== null;
    }

    loadSound(url, name) {
        if (this.hasAudio()) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            const that = this;
            xhr.onload = function () {
                that.audioContext.decodeAudioData(
                    xhr.response,
                    function (data: AudioBuffer) {
                        that.sounds[name] = data;
                    },
                );
            };
            xhr.send();
        }
    }

    playSound(name) {
        if (this.hasAudio() && this.sounds[name]) {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.sounds[name];
            source.connect(this.audioGain);
            source.start(0);
        }
    }
}
