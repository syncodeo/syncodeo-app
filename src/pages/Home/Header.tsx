import React from 'react';
import { Row, Col, Icon, Menu, Button, Popover } from 'antd';

import { Link } from 'react-router-dom';
import Login from '../../components/Login/Login';
import { MenuMode } from 'antd/lib/menu';
import { IStateStore } from '../../interfaces/Store';
import { connect } from 'react-redux';
import translate from '../../localization';
import { History } from 'history';

interface IProps extends IStateToProps {
    history: History;
    isMobile: boolean;
}

interface IState {
    menuVisible: boolean;
    menuMode: MenuMode;
}

class Header extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            menuVisible: false,
            menuMode: 'horizontal',
        }
    }

    componentWillReceiveProps(nextProps: IProps){
        if(nextProps.isMobile !== this.props.isMobile){
            this.setState({ menuMode: nextProps.isMobile ? 'inline' : 'horizontal' })
        }
    }

    handleShowMenu = () => {
        this.setState({ menuVisible: !this.state.menuVisible, });
    }

    render() {
        const { menuMode, menuVisible } = this.state;

        const menu = (
            <Menu mode={menuMode} id="nav" key="nav">
                {menuMode === 'inline' && menuVisible && this.props.isLogged && (
                    <Menu.Item>
                        <Link to={"/user/" + this.props.userConnectedUuid}>
                            <Button icon="user" block>{translate('yourChannel')}</Button>
                        </Link>
                    </Menu.Item>
                )}
                {menuMode === 'inline' && menuVisible && (
                    <Menu.Item>
                        <Login redirectToDashboard={this.props.history} block />
                    </Menu.Item>
                )}
            </Menu>
        );

        return (
            <div id="header" className="header">
                {menuMode === 'inline' ? (
                    <Popover
                        overlayClassName="popover-menu"
                        placement="bottomRight"
                        content={menu}
                        trigger="click"
                        visible={menuVisible}
                    >
                        <Icon
                            className="nav-phone-icon"
                            type="menu"
                            onClick={this.handleShowMenu}
                        />
                    </Popover>
                ) : null}
                <Row>
                    <Col xxl={4} xl={5} lg={8} md={8} sm={24} xs={24}>
                        <div id="logo">
                            <img src={require('../../img/logo/logo-syncodeo.png')} alt="logo" />
                        </div>
                    </Col>
                    <Col xxl={20} xl={19} lg={16} md={16} sm={0} xs={0}>
                        <div className="header-meta">
                            <div id="preview">
                                {this.props.isLogged && (
                                    <Link to={"/user/" + this.props.userConnectedUuid}>
                                        <Button icon="user" style={{ marginRight: 15, }}>{translate('yourChannel')}</Button>
                                    </Link>
                                )}
                                <Login redirectToDashboard={this.props.history} />
                            </div>
                            {menuMode === 'horizontal' ? <div id="menu">{menu}</div> : null}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

interface IStateToProps {
    isLogged: IStateStore['isLogged'];
    userConnectedUuid: IStateStore['userConnectedUuid'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        isLogged: state.isLogged,
        userConnectedUuid: state.userConnectedUuid,
    }
};

export default connect(mapStateToProps, null)(Header);
