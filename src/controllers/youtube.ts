import EventEmitter from 'events';

class YouTube {

    player: any;
    playerCurrentTime: number;
    videoId: string;
    duration: number = 0;
    youtubeEventEmitter: EventEmitter = new EventEmitter();

    clear() {
        try {
            this.player = undefined;
            this.duration = 0;
        } catch{ }
    }

    finishedVideo() {
        try {
            return this.player.getPlayerState() === 0;
        } catch{ }
    }

    seekTo(time: number) {
        try {
            this.player.seekTo(time);
        } catch{ }
    }

    play() {
        try {
            this.player.playVideo();
        } catch{ }
    }

    pause() {
        try {
            this.player.pauseVideo();
        } catch{ }
    }
}

export default new YouTube();