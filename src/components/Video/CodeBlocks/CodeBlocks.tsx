import './CodeBlocks.less';

// React & Redux
import React, { useContext } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

// Actions
import { incrementLoading, decrementLoading, ILoadingAction, } from '../../../actions/loading';

// Controllers
import YouTubeController from '../../../controllers/youtube';
import MonacoEditorController from '../../../controllers/monacoEditor';

// Components
import CodeBlock from './CodeBlock/CodeBlock';
import { Tabs, Icon, Switch, Menu, Dropdown, Button, Modal, Spin, } from 'antd';
import Explorer from '../Explorer/Explorer';
import { IStateStore } from '../../../interfaces/Store';
import { IActualMonacoModelAction, updateActualMonacoModel } from '../../../actions/actualMonacoModel';
import AddCodeBlock from './AddCodeBlock/AddCodeBlock';
import VideoInfo from '../VideoInfo/VideoInfo';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DeleteCodeBlock from './AddCodeBlock/DeleteCodeBlock';
import translate from '../../../localization';
import { copyToClipboard } from '../../../helpers/functions';
import PlaylistList from '../PlaylistList/PlaylistList';
import { IActualPlaylistAction, updateActualPlaylist } from '../../../actions/actualPlaylist';
import { Link } from 'react-router-dom';
import ResizeObserver from 'resize-observer-polyfill';
import { IPropsWatchContext } from '../../../pages/Watch/Watch';
import ShareModal from '../../ShareModal/ShareModal';

interface IProps extends IStateToProps, IDispatchToProps, IPropsWatchContext {
    tabs?: boolean;
    setActiveTabKey: (activeTabKey: string) => void;
}

interface IState {
    selectedTab: 'timeline' | 'github';
    playerCurrentTime: number;
    openEditCodePanel: boolean;

    tabsIcons: boolean;
    textNextPreviousVideo: boolean;

    showModalShare: boolean;

    files?: any[];
}

class CodeBlocks extends React.Component<IProps, IState> {

    modalShowed = false;
    resizeObserver: ResizeObserver;
    timeoutNextVideo: NodeJS.Timeout;

    constructor(props: any) {
        super(props);

        this.state = {
            playerCurrentTime: 0,
            selectedTab: 'timeline',
            openEditCodePanel: false,
            tabsIcons: false,
            textNextPreviousVideo: true,
            showModalShare: false,
        }

        this.youtubeEventEmitterListener = this.youtubeEventEmitterListener.bind(this);
    }

    componentWillReceiveProps(newProps: IProps){
        if(this.modalShowed && (this.props.videoId !== newProps.videoId || this.props.playlistUuid !== newProps.playlistUuid)){
            this.modalShowed = false;
        }
    }
    
    youtubeEventEmitterListener(playerCurrentTime: number) {
        if (!this.modalShowed && YouTubeController.finishedVideo() && this.props.nextVideo && this.props.videoId) {
            this.modalShowed = true;
            const timeoutNextVideo = setTimeout(() => {
                if (this.props.nextVideo) {
                    this.props.history.push('/watch?v=' + this.props.nextVideo.videoId + "&p=" + this.props.actualPlaylist.uuid);
                }
            }, 5000);
            let secondsToGo = 5;
            const modal = Modal.info({
                title: 'Next video',
                content: `Next video will open after ${secondsToGo} second.`,
                okText: 'Don\'t!',
                style: { top: 105, marginLeft: '25%', },
                maskStyle: { display: 'none', },
                okButtonProps: { type: "danger" },
                onOk: () => {
                    clearInterval(timer);
                    clearTimeout(timeoutNextVideo);
                    modal.destroy();
                }
            });
            const timer = setInterval(() => {
                secondsToGo -= 1;
                modal.update({
                    content: `Next video will open after ${secondsToGo} second.`,
                });
            }, 1000);
            setTimeout(() => {
                clearInterval(timer);
                modal.destroy();
            }, secondsToGo * 1000);
        }
        this.setState({ playerCurrentTime: Math.floor(playerCurrentTime) });
    }

    async componentDidMount() {
        YouTubeController.youtubeEventEmitter.on('playerCurrentTime', this.youtubeEventEmitterListener);

        // Resize Object
        this.resizeObserver = new ResizeObserver(entries => {
            let windowWidth = window.innerWidth;
            let paneWidth = entries[0].contentRect.width;
            const ratio = paneWidth / windowWidth;
            if (ratio <= 0.25) {
                this.setState({ tabsIcons: true, });
            } else {
                this.setState({ tabsIcons: false, });
            }

            if (ratio <= 0.25) {
                this.setState({ textNextPreviousVideo: false });
            } else {
                this.setState({ textNextPreviousVideo: true });
            }
        });
        this.resizeObserver.observe(document.getElementById('code-blocks-div'));
    }

    componentWillUnmount() {
        YouTubeController.youtubeEventEmitter.removeListener('playerCurrentTime', this.youtubeEventEmitterListener);
        this.resizeObserver.disconnect();
    }

    getVideoWithVideoId(videoId: string) {
        return this.props.actualPlaylist.videos.find(item => item.videoId === videoId);
    }

    render() {
        const { isLogged, itsMyVideo, activeCodeIndex, codes } = this.props;

        const codeBlocks = (
            <ul id="code-blocks">
                <Spin spinning={this.props.loading !== 0}>
                    {isLogged && itsMyVideo && activeCodeIndex === null && codes.length > 0 && <AddCodeBlock />}

                    {this.props.codes.length > 0
                        ?
                        this.props.codes.map((code, index) => {
                            let pourcentage = 0;
                            if (index === this.props.activeCodeIndex) {
                                let startTime = code.time;
                                let endTime = index >= this.props.codes.length - 1 ? YouTubeController.duration : this.props.codes[index + 1].time;
                                pourcentage = Math.floor(((this.state.playerCurrentTime - startTime) / (endTime - startTime)) * 100);
                            }
                            else if (code.time <= Math.floor(this.state.playerCurrentTime)) {
                                pourcentage = 100;
                            } else if (code.time > Math.floor(this.state.playerCurrentTime)) {
                                pourcentage = 0;
                            }
                            return <CodeBlock playerCurrentTime={this.state.playerCurrentTime} pourcentage={pourcentage} code={code} index={index} key={index} />
                        })
                        :
                        this.props.isLogged && this.props.itsMyVideo ? <AddCodeBlock /> : <h2>{translate('noCodeHere')}</h2>
                    }
                </Spin>
            </ul>
        )

        const { actualPlaylist, previousVideo, nextVideo } = this.props;
        const haveMenu = this.props.github || this.props.actualPlaylist;
        const menu = (
            <>
                {this.props.isLogged && this.props.itsMyVideo && <DeleteCodeBlock haveMenu={haveMenu !== null} />}

                {haveMenu && (
                    <ul id="menu">
                        {actualPlaylist && (
                            <ul style={{ float: 'left', marginLeft: 5, }}>
                                <li>
                                    {!previousVideo ? (
                                        <Button icon="step-backward" type="primary" disabled>{this.state.textNextPreviousVideo && <span> Previous video</span>}</Button>
                                    ) : (
                                            <Link to={"/watch?v=" + previousVideo.videoId + '&p=' + actualPlaylist.uuid}>
                                                <Button icon="step-backward" loading={this.props.loading !== 0} type="primary">{this.state.textNextPreviousVideo && <span> Previous video</span>}</Button>
                                            </Link>
                                        )}
                                </li>
                                <li>{
                                    <span>{actualPlaylist.videos.findIndex(item => item.videoId === this.props.videoId) + 1}/{actualPlaylist.videos.length}</span>
                                }</li>
                                <li>
                                    {!nextVideo ? (
                                        <Button type="primary" disabled>{this.state.textNextPreviousVideo && <span>Next video </span>}<Icon type="step-forward" /></Button>
                                    ) : (
                                            <Link to={"/watch?v=" + nextVideo.videoId + '&p=' + actualPlaylist.uuid}>
                                                <Button icon={!this.state.textNextPreviousVideo ? 'step-forward' : null} loading={this.props.loading !== 0} type="primary">{this.state.textNextPreviousVideo && <span>Next video <Icon type="step-forward" /></span>}</Button>
                                            </Link>
                                        )}
                                </li>
                            </ul>
                        )}
                        {this.props.github && (
                            <li>
                                <Switch
                                    loading={this.props.loading !== 0}
                                    checkedChildren={<Icon type="line-chart" />}
                                    unCheckedChildren={<Icon type="github" />}
                                    onChange={() => {
                                        const { actualMonacoModel, updateActualMonacoModel, codes, activeCodeIndex, } = this.props;

                                        if (actualMonacoModel === MonacoEditorController.githubModel) {
                                            const code = codes[activeCodeIndex];
                                            updateActualMonacoModel(activeCodeIndex === null ? null : MonacoEditorController.models[code.uuid].model);
                                        }
                                        else {
                                            updateActualMonacoModel(MonacoEditorController.githubModel);
                                        }
                                    }}
                                    checked={this.props.actualMonacoModel !== MonacoEditorController.githubModel}
                                    style={{ marginBottom: 6, backgroundColor: '#3D2FAB', }} />
                            </li>
                        )}
                    </ul>
                )}
            </>
        )

        const contextMenu = (
            <Menu>
                <Menu.Item onClick={param => {
                    param.domEvent.stopPropagation();
                    this.setState({ showModalShare: true });
                }}>
                    <span><Icon type="share-alt" /> {translate('shareVideo')}</span>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href={"https://youtube.com/watch?v=" + YouTubeController.videoId}><Icon type="youtube" /> {translate('openOnYoutube')}</a>
                </Menu.Item>
                {this.props.github && (
                    <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href={this.props.github}><Icon type="github" /> {translate('openGithubRepository')}</a>
                    </Menu.Item>
                )}
            </Menu>
        )
        const extraIcon = (
            <Dropdown overlay={contextMenu} trigger={['click']}>
                <Icon style={{ fontSize: 25, cursor: 'pointer', marginRight: 15, marginTop: 10, }} type="ellipsis" />
            </Dropdown>
        )

        return (
            <div id="code-blocks-div">
                {<ShareModal
                    video={this.props.video}
                    visible={this.state.showModalShare}
                    onCancel={() => this.setState({ showModalShare: false })}
                />}
                <Tabs
                    tabBarStyle={{ marginBottom: 0 }}
                    tabBarGutter={0}
                    tabBarExtraContent={extraIcon}
                    onChange={activeTabKey => this.props.setActiveTabKey(activeTabKey)}
                    activeKey={this.props.activeTabKey}
                    className="tabs"
                >
                    <Tabs.TabPane className="tab" style={{ height: !haveMenu ? 'calc(100% - 50px)' : null }} tab={<span><Icon type="line-chart" />{!this.state.tabsIcons && translate('timeline')}</span>} key="timeline">
                        {codeBlocks}
                    </Tabs.TabPane>
                    {this.props.github && this.props.tabs && (
                        <Tabs.TabPane className="tab" style={{ height: !haveMenu ? 'calc(100% - 50px)' : null }} tab={<span><Icon type="github" />{!this.state.tabsIcons && translate('github')}</span>} key="github">
                            <Explorer github={this.props.github} />
                        </Tabs.TabPane>
                    )}
                    <Tabs.TabPane className="tab" style={{ height: !haveMenu ? 'calc(100% - 50px)' : null }} tab={<span><Icon type="info" />{!this.state.tabsIcons && translate('information')}</span>} key="info">
                        <VideoInfo video={this.props.video} github={this.props.github} />
                    </Tabs.TabPane>
                    {this.props.playlists && this.props.playlists.length > 0 && (
                        <Tabs.TabPane className="tab" style={{ height: !haveMenu ? 'calc(100% - 50px)' : null }} tab={<span><Icon type="ordered-list" />{!this.state.tabsIcons && translate('playlists')}</span>} key="playlist">
                            <PlaylistList videoId={this.props.videoId} playlistUuid={this.props.playlistUuid} playlists={this.props.playlists} />
                        </Tabs.TabPane>
                    )}
                </Tabs>
                {menu}
            </div>
        )
    }
}

interface IStateToProps {
    loading: IStateStore['loading'];
    activeCodeIndex: IStateStore['activeCodeIndex'];
    codes: IStateStore['codes'];
    itsMyVideo: IStateStore['itsMyVideo'];
    isLogged: IStateStore['isLogged'];
    actualMonacoModel: IStateStore['actualMonacoModel'];
    actualPlaylist: IStateStore['actualPlaylist'];
    userUuid: IStateStore['userUuid'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        loading: state.loading,
        activeCodeIndex: state.activeCodeIndex,
        codes: state.codes,
        itsMyVideo: state.itsMyVideo,
        isLogged: state.isLogged,
        actualMonacoModel: state.actualMonacoModel,
        actualPlaylist: state.actualPlaylist,
        userUuid: state.userUuid,
    };
};

interface IDispatchToProps {
    incrementLoading: ILoadingAction['incrementLoading'];
    decrementLoading: ILoadingAction['decrementLoading'];
    updateActualMonacoModel: IActualMonacoModelAction['updateActualMonacoModel'];
    updateActualPlaylist: IActualPlaylistAction['updateActualPlaylist'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        incrementLoading: bindActionCreators(incrementLoading, dispatch),
        decrementLoading: bindActionCreators(decrementLoading, dispatch),
        updateActualMonacoModel: bindActionCreators(updateActualMonacoModel, dispatch),
        updateActualPlaylist: bindActionCreators(updateActualPlaylist, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(CodeBlocks));