import React from 'react';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import LogoHome from './component/LogoHome';
import LastSponsors from '../../components/LastSponsors/LastSponsors';

interface IProps {
    isMobile: boolean;
}

interface IState {}

export default class Banner extends React.Component<IProps, IState>{

    render() {
        const { isMobile } = this.props;

        return (
            <div className={`banner-wrapper`}>
                <QueueAnim className={`banner-title-wrapper ${this.props.isMobile && 'mobile'}`} type={this.props.isMobile ? 'bottom' : 'right'}>
                    <div key="line" className="title-line-wrapper"></div>
                    <h1 key="h1"><img alt="syncodeo" src={require('../../img/syncodeo.png')} style={{ width: '75%', zIndex: 1, }} /></h1>
                    <p key="content">
                        Learn faster. Share better.<br />
                        Increase accessibility together.<br />
                        Through a unique platform.
                </p>
                    <div key="button" className="button-wrapper">
                        <Link to="/search">
                            <Button type="primary">Search for a video</Button>
                        </Link>
                        <a href="https://discuss.syncodeo.io/d/1-open-beta-is-here-be-ready" target="_blank" rel="noopener noreferrer">
                            <Button style={{ margin: '0 16px' }} type="primary" ghost>Learn more</Button>
                        </a>
                    </div>
                </QueueAnim>
                {!this.props.isMobile && (
                    <TweenOne animation={{ opacity: 1 }} className="banner-image-wrapper">
                        <LogoHome />
                    </TweenOne>
                )}
                {/* TODO: Add for sponsors */}
                {/* <LastSponsors isMobile={isMobile} /> */}
            </div>
        )
    }
}