import './User.less';

// React & Redux
import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { IStateStore } from '../../interfaces/Store';
import { User as IUser } from '../../interfaces/User';
import { getUserInfo } from '../../controllers/user';
import { RouteComponentProps, } from 'react-router-dom';
import { Tabs, Icon, Switch, Tooltip, Popover } from 'antd';
import Videos from '../../components/User/Videos/Videos';
import Playlists from '../../components/User/Playlists/Playlists';
import translate from '../../localization';
import FormAddVideo from '../../components/Dashboard/FormAddVideo/FormAddVideo';
import { IGridListAction, updateGridList } from '../../actions/gridList';
import { bindActionCreators } from 'redux';
import UserNameAvatar from '../../components/User/UserNameAvatar/UserNameAvatar';
import { ILeftMenuAction, updateLeftMenu } from '../../actions/leftMenu';
import { IShow404Action, setShow404 } from '../../actions/show404';
import { hideLoading } from 'react-redux-loading-bar';

interface IProps extends IStateToProps, IDispatchToProps {
    route: RouteComponentProps;
}

interface IState {
    tab: string;
    user: IUser;
    playlistNeedToBeReload: boolean;
    playlistsInVideosNeedToBeReload: boolean;
    canEdit?: boolean;
    youtubeAccountLinked: boolean;

    //Loadings
    getUserInfoLoading: boolean;
}

class User extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            tab: props.route.match.params['tab'],
            user: undefined,
            playlistNeedToBeReload: false,
            playlistsInVideosNeedToBeReload: false,
            youtubeAccountLinked: false,
            getUserInfoLoading: true,
        }
        props.updateLeftMenu({
            selectedKeys: [props.route.match.params['id'] === props.userConnectedUuid ? 'channel' : ''],
            justLeftMenu: true,
        });
    }

    async componentWillMount() {
        await this.init(this.props);
    }

    async init(props: IProps) {
        try {
            const { route, userConnectedUuid } = props;
            const { data: user } = await getUserInfo(route.match.params['id']);
            await this.setState({ user, canEdit: user.uuid === userConnectedUuid, youtubeAccountLinked: user.channelId !== null, getUserInfoLoading: false, });
            const { canEdit, youtubeAccountLinked } = this.state;
            if (!canEdit && !youtubeAccountLinked) throw "not-found";
        } catch{
            this.props.setShow404();
        }
        this.props.hideLoading();
    }

    async componentWillReceiveProps(nextProps: IProps) {
        this.props.hideLoading();
        let selectedKeys = [nextProps.route.match.params['id'] === nextProps.userConnectedUuid ? 'channel' : ''];
        if (nextProps.leftMenu.selectedKeys[0] != selectedKeys[0]) {
            nextProps.updateLeftMenu({ selectedKeys, justLeftMenu: true, });
        }
        if (nextProps.route.match.params['id'] !== this.props.route.match.params['id']) {
            await this.init(nextProps);
        }
        if (this.props.isLogged !== nextProps.isLogged) {
            await this.setState({ canEdit: nextProps.isLogged && nextProps.userConnectedUuid === nextProps.route.match.params['id'] });
            if (!this.state.canEdit) {
                if (!this.state.youtubeAccountLinked) {
                    this.props.setShow404();
                } else {
                    this.props.route.history.push('/user/' + this.state.user.uuid);
                    await this.setState({ tab: 'videos' });
                }
            }
        } else if (this.state.tab !== nextProps.route.match.params['tab']) {
            this.setState({ tab: nextProps.route.match.params['tab'] });
        }
    }

    setAccountLinked = (channelId: string) => {
        this.setState({ youtubeAccountLinked: true, user: { ...this.state.user, channelId } });
    }

    setLoadPlaylist = (loadPlaylist: boolean) => {
        this.setState({ playlistNeedToBeReload: loadPlaylist });
    }

    setLoadPlaylistsInVideos = (loadPlaylistInVideos: boolean) => {
        this.setState({ playlistsInVideosNeedToBeReload: loadPlaylistInVideos });
    }

    render() {
        const { user, canEdit, youtubeAccountLinked } = this.state;

        return (
            <div id="user">
                {user &&
                    <div>
                        <div className="header">
                            <UserNameAvatar
                                user={user}
                                bigAvatar
                                getUserInfoLoading={this.state.getUserInfoLoading}
                                youtubeAccountShareButton
                                youtubeAccountLinked={youtubeAccountLinked}
                                setAccoutLinked={this.setAccountLinked}
                            />
                        </div>
                        <Tabs
                            tabBarExtraContent={
                                <>
                                    <span>Display </span>
                                    <Switch
                                        checkedChildren={<Icon type="appstore" />}
                                        unCheckedChildren={<Icon type="ordered-list" />}
                                        onClick={gridList => this.props.updateGridList(gridList)}
                                        checked={this.props.gridList}
                                        style={{ marginRight: 15, backgroundColor: '#3D2FAB', }}
                                    />
                                </>
                            }
                            activeKey={this.state.tab || (this.state.youtubeAccountLinked ? 'videos' : 'collaboratives')}
                            tabBarStyle={{ marginBottom: 0, background: '#E7E7E7' }}
                            onChange={(activeKey) => {
                                this.props.route.history.push('/user/' + user.uuid + '/' + activeKey);
                                this.setState({ tab: activeKey });

                            }}
                            style={{ background: 'white' }}
                        >
                            <Tabs.TabPane className="tab" tab={<span><Icon type="youtube" /> {canEdit ? translate('yourVideos') : translate('videos')}</span>} key="videos" disabled={!youtubeAccountLinked}>
                                <Videos
                                    needToBeReloaded={this.state.playlistsInVideosNeedToBeReload}
                                    setLoadPlaylistsInVideos={this.setLoadPlaylistsInVideos}
                                    setLoadPlaylist={this.setLoadPlaylist}
                                    userUuid={user.uuid}
                                    history={this.props.route.history}
                                    gridList={this.props.gridList}
                                    canEdit={this.state.canEdit}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane className="tab" tab={<span><Icon type="ordered-list" /> {canEdit ? translate('yourPlaylists') : translate('playlists')}</span>} key="playlists" disabled={!youtubeAccountLinked}>
                                <Playlists
                                    setLoadPlaylist={this.setLoadPlaylist}
                                    setLoadPlaylistsInVideos={this.setLoadPlaylistsInVideos}
                                    needToBeReload={this.state.playlistNeedToBeReload}
                                    gridList={this.props.gridList}
                                    canEdit={this.state.canEdit}
                                    userUuid={user.uuid}
                                />
                            </Tabs.TabPane>
                            {canEdit && (
                                <Tabs.TabPane className="tab" tab={<span><Icon type="usergroup-add" /> {translate('collaborativesVideo')}</span>} key="collaboratives">
                                    <Videos userUuid={user.uuid} history={this.props.route.history} collaboratives gridList={this.props.gridList} canEdit={false} />
                                </Tabs.TabPane>
                            )}
                            {canEdit && (
                                <Tabs.TabPane className="tab" tab={<span><Icon type="plus" /> {translate('addVideo')}</span>} key="add" disabled={!youtubeAccountLinked}>
                                    <FormAddVideo gridList={this.props.gridList} />
                                </Tabs.TabPane>
                            )}
                        </Tabs>
                    </div>
                }
            </div>
        )
    }
}

interface IStateToProps {
    userConnectedUuid: IStateStore['userConnectedUuid'];
    isLogged: IStateStore['isLogged'];
    gridList: IStateStore['gridList'];
    leftMenu: IStateStore['leftMenu'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        userConnectedUuid: state.userConnectedUuid,
        isLogged: state.isLogged,
        gridList: state.gridList,
        leftMenu: state.leftMenu
    }
};

interface IDispatchToProps {
    updateGridList: IGridListAction['updateGridList'];
    updateLeftMenu: ILeftMenuAction['updateLeftMenu'];
    setShow404: IShow404Action['setShow404'];
    hideLoading: typeof hideLoading;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateGridList: bindActionCreators(updateGridList, dispatch),
        updateLeftMenu: bindActionCreators(updateLeftMenu, dispatch),
        setShow404: bindActionCreators(setShow404, dispatch),
        hideLoading: bindActionCreators(hideLoading, dispatch),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(User);