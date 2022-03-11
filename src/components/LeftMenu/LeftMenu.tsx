import './LeftMenu.less';

// React & Redux
import React from 'react';
import { Link, } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Actions
import { updateMenuCollapsed, IMenuCollapsedAction } from '../../actions/menuCollapsed';
import { updateIsLogged, IIsLoggedAction } from '../../actions/isLogged';
import { updateActualLayout, IActualLayoutAction } from '../../actions/actualLayout';
import { updateItsMyVideo, IItsMyVideoAction } from '../../actions/itsMyVideo';

// Components
import { Icon, Menu, Layout } from 'antd';
import FeedbackDrawer from '../Drawers/FeedbackDrawer/FeedbackDrawer';

// Interfaces
import { IStateStore } from '../../interfaces/Store';
import Login from '../Login/Login';
import translate from '../../localization';
import Tutorial from '../Tutorial/Tutorial';

interface IProps extends IStateToProps, IDispatchToProps {
    selectedKeys?: string[];
    isWatchPage?: boolean;
    feedback?: boolean;
    haveGithubLink?: boolean;
}

interface IState {
    showLeftMenuDrawer: boolean;
    showFeedbackDrawer: boolean;
    showSearchDrawer: boolean;
    showTutorialModal: boolean;
}

class LeftMenu extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            showLeftMenuDrawer: false,
            showFeedbackDrawer: false,
            showSearchDrawer: false,
            showTutorialModal: false,
        };
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (this.state.showFeedbackDrawer !== nextProps.feedback) {
            this.setState({ showFeedbackDrawer: nextProps.feedback });
        }
    }

    render() {
        const { Sider } = Layout;
        const { selectedKeys, isMobile } = this.props;
        const { showLeftMenuDrawer } = this.state;

        return (
            <>
                {isMobile && (
                    <Icon
                        type={showLeftMenuDrawer ? 'menu-fold' : 'menu-unfold'}
                        style={{
                            position: 'fixed',
                            left: showLeftMenuDrawer ? 80 : 0,
                            transition: 'all 0.2s ease-in-out',
                            bottom: 0,
                            fontSize: 25,
                            zIndex: 2,
                            background: '#001529',
                            color: '#FEFEFE',
                            padding: 10,
                        }}
                        onClick={() => this.setState({ showLeftMenuDrawer: !showLeftMenuDrawer })}
                    />
                )}
                <Sider
                    style={{
                        position: isMobile ? 'fixed' : 'relative',
                        transition: 'all 0.2s ease-in-out',
                        top: 0,
                        left: isMobile ? (showLeftMenuDrawer ? 0 : -80) : 0,
                        height: '100vh'
                    }}
                    theme="dark"
                    trigger={undefined}
                    collapsible={!isMobile}
                    collapsed={isMobile ? true : this.props.menuCollapsed}
                    onCollapse={(collapsed) => this.props.updateMenuCollapsed(collapsed)}
                    id="left-menu"
                >
                    <Link to="/">
                        <div style={{ height: 32, background: 'rgba(255,255,255,.2)', margin: 16 }}>
                            <h2 style={{ color: 'white', textAlign: 'center' }}>
                                {isMobile ? (
                                    <span>S</span>
                                ) : (this.props.menuCollapsed
                                    ?
                                    <span>S</span>
                                    :
                                    <span>Syncodeo</span>
                                    )}
                            </h2>
                        </div>
                    </Link>
                    <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
                        <Menu.Item key="search">
                            <Link to="/search">
                                <Icon type="search" />
                                <span>{translate('search')}</span>
                            </Link>
                        </Menu.Item>

                        {this.props.isLogged && (
                            <Menu.Item key="channel">
                                <Link to={"/user/" + this.props.userConnectedUuid}>
                                    <Icon type="user" />
                                    <span>{translate('yourChannel')}</span>
                                </Link>
                            </Menu.Item>
                        )}

                        {this.props.isWatchPage && this.props.haveGithubLink && (
                            <Menu.SubMenu key="layout" title={<span><Icon type="layout" /><span>{translate('layout')}</span></span>}>
                                <Menu.Item key="layout-1">
                                    <a onClick={(e) => { e.stopPropagation(); this.props.updateActualLayout('layout-1') }}>
                                        <Icon type="layout" />
                                        <span>{translate('layout') + ' ' + translate('one')}</span>
                                    </a>
                                </Menu.Item>
                                <Menu.Item key="layout-2" >
                                    <a onClick={(e) => { e.stopPropagation(); this.props.updateActualLayout('layout-2') }}>
                                        <Icon type="layout" />
                                        <span>{translate('layout') + ' ' + translate('two')}</span>
                                    </a>
                                </Menu.Item>
                            </Menu.SubMenu>
                        )}
                    </Menu>

                    <Menu theme="dark" mode="inline" style={{ position: 'absolute', bottom: isMobile ? 100 : 50, left: 0 }}>

                        {this.props.isWatchPage && (
                            <Menu.Item key="tutorial">
                                <a onClick={(e) => { e.stopPropagation(); this.setState({ showTutorialModal: true, }); }}>
                                    <Icon type="question" />
                                    <span>{translate('tutorial')}</span>
                                </a>
                            </Menu.Item>
                        )}

                        <Menu.Item className="item-contacts" title="Share your experience!" onClick={(e) => {
                            this.setState({ showFeedbackDrawer: true, });
                        }}>
                            <Icon type="notification" />
                            <span>{translate('contacts')}</span>
                        </Menu.Item>

                        <Menu.SubMenu key="info" title={<span><Icon type="info" /><span>{translate('information')}</span></span>}>
                            <Menu.Item key="story" >
                                <Link to="/story" onClick={e => e.stopPropagation()}>
                                    <span>{translate('story')}</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="terms">
                                <Link to="/terms" onClick={e => e.stopPropagation()}>
                                    <span>{translate('terms')}</span>
                                </Link>
                            </Menu.Item>
                        </Menu.SubMenu>

                        <Menu.Item onClick={e => e.domEvent.stopPropagation()}>
                            <Login icon />
                        </Menu.Item>
                    </Menu>
                </Sider>
                <FeedbackDrawer showFeedbackDrawer={this.state.showFeedbackDrawer} onCloseFeedbackDrawer={() => this.setState({ showFeedbackDrawer: false, })} />
                <Tutorial visible={this.state.showTutorialModal} onCancel={() => this.setState({ showTutorialModal: false, })} />
            </>
        )
    }
}

interface IStateToProps {
    menuCollapsed: IStateStore['menuCollapsed'];
    isLogged: IStateStore['isLogged'];
    isMobile: IStateStore['isMobile'];
    userConnectedUuid: IStateStore['userConnectedUuid'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        menuCollapsed: state.menuCollapsed,
        isLogged: state.isLogged,
        isMobile: state.isMobile,
        userConnectedUuid: state.userConnectedUuid,
    }
};

interface IDispatchToProps {
    updateMenuCollapsed: IMenuCollapsedAction['updateMenuCollapsed'];
    updateIsLogged: IIsLoggedAction['updateIsLogged'];
    updateItsMyVideo: IItsMyVideoAction['updateItsMyVideo'];
    updateActualLayout: IActualLayoutAction['updateActualLayout'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateMenuCollapsed: bindActionCreators(updateMenuCollapsed, dispatch),
        updateIsLogged: bindActionCreators(updateIsLogged, dispatch),
        updateItsMyVideo: bindActionCreators(updateItsMyVideo, dispatch),
        updateActualLayout: bindActionCreators(updateActualLayout, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu);