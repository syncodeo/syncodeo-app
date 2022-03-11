import React from 'react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';

class WhatSyncodeo extends React.PureComponent {
    render() {
        return (
            <div className="home-page what-syncodeo" id="what-syncodeo">
                <div className="home-page-wrapper" id="what-syncodeo-wrapper">
                    <h2>What is <span>Syncodéo</span></h2>
                    <OverPack>
                        <QueueAnim
                            className="what-syncodeo-box-wrapper"
                            type="top"
                            key="key"
                            leaveReverse
                            component="div"
                        >
                            <p key="text" className="text">
                                Syncodéo is an online platform that synchronize videos and codes at the same place.
                                <br />
                                Start adding a video now and share!
                            </p>
                        </QueueAnim>
                    </OverPack>
                </div>
            </div>
        );
    }
}

export default WhatSyncodeo;