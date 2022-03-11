import './Twitter.less';
import React from 'react';

export default class Twitter extends React.Component<any, any>{
    render() {
        return (
            <a className="twitter-timeline" href="https://twitter.com/syncodeo?ref_src=twsrc%5Etfw">
                Tweets by syncodeo
            </a>
        )
    }
}