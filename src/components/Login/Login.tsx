import './Login.less';

import React from 'react';
import { Button, message, Icon } from 'antd';

import { bindActionCreators } from 'redux';
import { updateIsLogged, IIsLoggedAction } from '../../actions/isLogged';
import { connect } from 'react-redux';
import { IStateStore } from '../../interfaces/Store';
import { deleteToken, setTokens, removeTokenEmitter } from '../../controllers/token';
import { login } from '../../controllers/accounts';
import { GOOGLE_CLIENT_ID } from '../../constants/env';
import translate from '../../localization';
import { IUserConnectedUuidAction, updateUserConnectedUuid } from '../../actions/userConnectedUuid';
import { History } from 'history';

interface IProps extends IStateToProps, IDispatchToProps {
    icon?: boolean;
    needLoggedIn?: boolean;
    /**
     * Redirect to dashboard but pass history in props
     */
    redirectToDashboard?: History;
    block?: boolean;
}

interface IState {
    actionLoading: boolean;
    redirectToDashboard: boolean;
}

declare global {
    interface Window {
        gapi: any;
    }
}

class Login extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);
        this.state = {
            actionLoading: false,
            redirectToDashboard: false,
        }
    }

    isSignedOut = () => {
        this.props.updateIsLogged();
        this.setState({ actionLoading: false });
        this.props.updateUserConnectedUuid(null);
        message.success(translate('youSignedOut'));
    };

    componentDidMount() {
        removeTokenEmitter.on('isSignedOut', this.isSignedOut);

        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: GOOGLE_CLIENT_ID
            }).then(() => {
                this.setState({
                    actionLoading: false,
                });
            });
        });
    }

    componentWillUnmount() {
        removeTokenEmitter.removeListener('isSignedOut', this.isSignedOut);
    }

    handleSignIn = async () => {
        this.setState({ actionLoading: true });
        try {
            const googleUser = await window.gapi.auth2.getAuthInstance().signIn();
            const { data: response } = await login(googleUser.getAuthResponse().id_token);
            setTokens(response.accessToken, response.refreshToken, response.accessTokenExpiresIn);
            this.props.updateUserConnectedUuid(response.uuid);
            this.props.updateIsLogged();
            if (this.props.redirectToDashboard) this.props.redirectToDashboard.push('/user/' + response.uuid);
        } catch{ }

        this.setState({ actionLoading: false, });
    }

    handleSignOut = async () => {
        this.setState({ actionLoading: true });
        await window.gapi.auth2.getAuthInstance().signOut();
        deleteToken();
        this.setState({ actionLoading: false });
    }

    onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (this.props.isLogged) {
            this.handleSignOut();
        }
        else {
            this.handleSignIn();
        }
    }

    render() {
        return (
            this.props.needLoggedIn ? (
                <div id="login">
                    <div className="need-logged-in">
                        <div className="panel" onClick={this.onClick}></div>
                        <span className="text" style={{ pointerEvents: 'none' }}>
                            {translate('needBeLogin')}
                            <br />
                            {translate('clickToLogin')}
                        </span>
                        {this.props.children}
                    </div>
                </div>
            ) : (
                    this.props.icon ?
                        <a onClick={this.onClick}>
                            <Icon type={this.props.isLogged ? 'logout' : 'google'} />
                            <span>{this.props.isLogged ? translate('logout') : translate('login')}</span>
                        </a>
                        :
                        <Button
                            block={this.props.block}
                            type="primary"
                            loading={this.state.actionLoading}
                            onClick={this.onClick}
                            icon={this.props.isLogged ? 'logout' : 'google'}
                        >
                            {this.props.isLogged ? translate('logout') : translate('login')}
                        </Button>
                )
        )
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

interface IDispatchToProps {
    updateIsLogged: IIsLoggedAction['updateIsLogged'];
    updateUserConnectedUuid: IUserConnectedUuidAction['updateUserConnectedUuid'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateIsLogged: bindActionCreators(updateIsLogged, dispatch),
        updateUserConnectedUuid: bindActionCreators(updateUserConnectedUuid, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);