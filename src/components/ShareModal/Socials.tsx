import React, { Component } from 'react';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    PinterestShareButton,
    VKShareButton,
    OKShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton,
    TumblrShareButton,
    LivejournalShareButton,

    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    PinterestIcon,
    VKIcon,
    OKIcon,
    TelegramIcon,
    WhatsappIcon,
    RedditIcon,
    TumblrIcon,
    LivejournalIcon,
} from 'react-share';

import './Socials.css';
import syncodeoImage from '../../img/logo/logo-syncodeo.png';

interface IProps{
    shareUrl: string;
    title: string;
}

interface IState {

}

class Social extends Component<IProps, IState> {
    render() {
        const { shareUrl, title } = this.props;

        return (
            <div className="Demo__container">
                <div className="Demo__some-network">
                    <FacebookShareButton
                        url={shareUrl}
                        quote={title}
                        separator=" - "
                        className="Demo__some-network__share-button">
                        <FacebookIcon
                            size={32}
                            round />
                    </FacebookShareButton>
                </div>

                <div className="Demo__some-network">
                    <TwitterShareButton
                        url={shareUrl}
                        title={title + " - "}
                        className="Demo__some-network__share-button">
                        <TwitterIcon
                            size={32}
                            round />
                    </TwitterShareButton>
                </div>

                <div className="Demo__some-network">
                    <TelegramShareButton
                        url={shareUrl}
                        title={title}
                        className="Demo__some-network__share-button">
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </div>

                <div className="Demo__some-network">
                    <WhatsappShareButton
                        url={shareUrl}
                        title={title}
                        separator=" - "
                        className="Demo__some-network__share-button">
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>

                <div className="Demo__some-network">
                    <LinkedinShareButton
                        url={shareUrl}
                        title={title}
                        windowWidth={750}
                        windowHeight={600}
                        className="Demo__some-network__share-button">
                        <LinkedinIcon
                            size={32}
                            round />
                    </LinkedinShareButton>
                </div>

                <div className="Demo__some-network">
                    <PinterestShareButton
                        url={String(window.location)}
                        media={`${String(window.location)}/${syncodeoImage}`}
                        windowWidth={1000}
                        windowHeight={730}
                        className="Demo__some-network__share-button">
                        <PinterestIcon size={32} round />
                    </PinterestShareButton>
                </div>

                <div className="Demo__some-network">
                    <VKShareButton
                        url={shareUrl}
                        image={`${String(window.location)}/${syncodeoImage}`}
                        windowWidth={660}
                        windowHeight={460}
                        className="Demo__some-network__share-button">
                        <VKIcon
                            size={32}
                            round />
                    </VKShareButton>
                </div>

                <div className="Demo__some-network">
                    <OKShareButton
                        url={shareUrl}
                        image={`${String(window.location)}/${syncodeoImage}`}
                        windowWidth={660}
                        windowHeight={460}
                        className="Demo__some-network__share-button">
                        <OKIcon
                            size={32}
                            round />
                    </OKShareButton>
                </div>

                <div className="Demo__some-network">
                    <RedditShareButton
                        url={shareUrl}
                        title={title}
                        windowWidth={660}
                        windowHeight={460}
                        className="Demo__some-network__share-button">
                        <RedditIcon
                            size={32}
                            round />
                    </RedditShareButton>
                </div>

                <div className="Demo__some-network">
                    <TumblrShareButton
                        url={shareUrl}
                        title={title}
                        windowWidth={660}
                        windowHeight={460}
                        className="Demo__some-network__share-button">
                        <TumblrIcon
                            size={32}
                            round />
                    </TumblrShareButton>
                </div>

                <div className="Demo__some-network" style={{ marginRight: 0 }}>
                    <LivejournalShareButton
                        url={shareUrl}
                        title={title}
                        description={shareUrl}
                        className="Demo__some-network__share-button"
                    >
                        <LivejournalIcon size={32} round />
                    </LivejournalShareButton>
                </div>
            </div>
        );
    }
}

export default Social;