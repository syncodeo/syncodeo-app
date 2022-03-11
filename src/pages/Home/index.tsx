import React from 'react';
import { enquireScreen } from 'enquire-js';

import Header from './Header';
import Banner from './Banner';
import WhySyncodeo from './WhySyncodeo';
import Footer from './Footer';
import './static/style';
import WhatSyncodeo from './WhatSyncodeo';
import { BackTop, Icon, } from 'antd';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideLoading } from 'react-redux-loading-bar';
import { IStateStore } from '../../interfaces/Store';

interface IProps extends IDispatchToProps, IStateToProps {
    route: RouteComponentProps;

}

interface IState {
    showArrow: boolean;
}

class Home extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);;

        this.state = {
            showArrow: window.scrollY === 0,
        }
    }

    scroll = (e) => {
        if (window.scrollY === 0 && !this.state.showArrow) {
            this.setState({ showArrow: true });
        } else if (this.state.showArrow) {
            this.setState({ showArrow: false });
        }
    }

    componentDidMount() {
        this.props.hideLoading();
        document.addEventListener('scroll', this.scroll);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.scroll);
    }

    render() {
        const { showArrow } = this.state;
        const { route, isMobile } = this.props;

        return (
            <div id="home">
                {!isMobile && showArrow && (
                    <Icon type="arrow-down" className={`arrow-down-icon ${isMobile && 'mobile'}`} onClick={() => {
                        let element = document.getElementById('what-syncodeo');
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }} />
                )}
                <BackTop />
                <video autoPlay loop muted id="background-home-video">
                    <source src={require('../../videos/BackgroundHomeSyncodeo.mp4')} type="video/mp4" />
                    <source src={require('../../videos/BackgroundHomeSyncodeo.webm')} type="video/webm" />
                </video>
                <Header history={route.history} isMobile={isMobile} />
                <div className="home-wrapper">
                    <Banner isMobile={isMobile} />
                    <WhatSyncodeo isMobile={isMobile} />
                    <WhySyncodeo isMobile={isMobile} />
                </div>
                <Footer />
            </div>
        );
    }
}

interface IStateToProps {
    isMobile: IStateStore['isMobile'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        isMobile: state.isMobile,
    }
};

interface IDispatchToProps {
    hideLoading: typeof hideLoading;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        hideLoading: bindActionCreators(hideLoading, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);