import React from 'react';

interface IProps {
    channelId: string;
}

interface IState { }

export default class YouTubeSubscribeButton extends React.Component<IProps, IState>{

    youtubeShareNode = React.createRef<HTMLDivElement>();

    componentDidMount() {
        const youtubeScript = document.createElement('script');
        youtubeScript.id = "youtube-script";
        youtubeScript.src = "https://apis.google.com/js/platform.js";
        this.youtubeShareNode.current.parentNode.appendChild(youtubeScript);
    }

    componentWillUnmount() {
        document.getElementById('youtube-script').remove();
    }

    render() {
        return (
            <div ref={this.youtubeShareNode} className="g-ytsubscribe" data-channelid={this.props.channelId} data-layout="full" data-count="default"></div>
        )
    }
}