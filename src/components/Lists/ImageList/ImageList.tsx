import './ImageList.less';

import React from 'react';
import Video from '../../../interfaces/Video';
import { Playlist } from '../../../interfaces/Playlists';

interface IProps {
    type: 'video' | 'playlist';
    item: Playlist | Video;
    notShowInformations?: boolean;
    gridList?: boolean;
    width?: number | string;
    height?: number | string;
}

interface IState {

}

export default class ImageList extends React.Component<IProps, IState>{

    render() {
        const { item, type, notShowInformations, width, height } = this.props;

        let playlist = item as Playlist;
        let video = item as Video;

        let thumbnails: Video[] = [];
        let minute, second;
        if (type === 'playlist' && playlist.videos.length > 0) {
            for (let i = 2; i >= 0; i--) {
                thumbnails.push(playlist.videos[i] || playlist.videos[0]);
            }
        } else {
            minute = Math.floor(video.duration / 60);
            second = video.duration - minute * 60;
            if (minute.toString().length === 1) minute = '0' + minute;
            if (second.toString().length === 1) second = '0' + second;
        }

        return (
            <div id={"image-list-" + this.props.type} style={{
                height: height ? height : null,
                width: width ? width : null,
                minWidth: width ? width : null,
                minHeight: height ? height : null,
                maxHeight: height ? height : null,
            }}>
                {type === 'video' ? (
                    video.status && video.status === 'private' ? (
                        <img width={'100%'} src={require('../../../img/videoNotFound.jpg')} />
                    ) : (
                            <div style={{ 
                                paddingTop: "56.25%", 
                                backgroundImage: `url(${"https://img.youtube.com/vi/" + video.videoId + "/mqdefault.jpg"})`,
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '100%',
                            }}></div>
                        )
                ) : (
                        thumbnails.length > 0 ? thumbnails.map((v, index) => (
                            <div className="image-playlist" key={index} style={{
                                backgroundImage: `url(${"https://img.youtube.com/vi/" + v.videoId + "/mqdefault.jpg"})`,
                            }}></div>
                        )) : <img width={'100%'} className="image-playlist" src={require('../../../img/videoNotFound.jpg')} />
                    )}
                {!notShowInformations && (
                    <div className={type === 'video' ? 'time' : 'number'}>
                        {type === 'video' ? <span>{minute}:{second}</span> : <span>x {playlist.videos.length}</span>}
                    </div>
                )}
            </div>
        )
    }
}