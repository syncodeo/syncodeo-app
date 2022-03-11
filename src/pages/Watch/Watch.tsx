import './Watch.less';

// React & Redux
import React, { CSSProperties } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Actions
import { incrementLoading, decrementLoading, resetLoading, ILoadingAction, } from '../../actions/loading';
import { updateItsMyVideo, IItsMyVideoAction } from '../../actions/itsMyVideo';
import { replaceAllCodes, ICodesAction, updateCode } from '../../actions/codes';

// Components
import YouTube from '../../components/Video/YouTube/YouTube';
import CodeBlocks from '../../components/Video/CodeBlocks/CodeBlocks';
import MonacoEditor from '../../components/Video/MonacoEditor/MonacoEditor';
import Explorer from '../../components/Video/Explorer/Explorer';
import SplitPane from 'react-split-pane';

// Controllers
import { getWatchInfo, getVideoInfo, } from '../../controllers/videos';
import MonacoController from '../../controllers/monacoEditor';
import { IStateStore } from '../../interfaces/Store';
import { downloadFile, generateDownloadUrl } from '../../controllers/github';
import { IActiveCodeIndexAction, updateActiveCodeIndex } from '../../actions/activeCodeIndex';
import { updateActiveEditCodeIndex, IActiveEditCodeIndexAction } from '../../actions/activeEditCodeIndex';
import queryString from 'query-string';
import { generateCorrespondanceLanguage } from '../../controllers/languages';
import { IUserUuidAction, updateUserUuid } from '../../actions/userUuid';
import { IActualMonacoModelAction, updateActualMonacoModel } from '../../actions/actualMonacoModel';
import { RouteComponentProps } from 'react-router';
import { ILeftMenuAction, updateLeftMenu } from '../../actions/leftMenu';
import { IActualPlaylistAction, updateActualPlaylist } from '../../actions/actualPlaylist';
import { getPlaylistFromUser } from '../../controllers/playlists';
import { Playlist } from '../../interfaces/Playlists';
import Video from '../../interfaces/Video';
import { IShow404Action, setShow404 } from '../../actions/show404';
import { hideLoading } from 'react-redux-loading-bar';

interface IProps extends IStateToProps, IDispatchToProps {
    route: RouteComponentProps;
}

interface IState {
    videoId: string;
    playlistUuid: string;
    time: number;
    playlists: Playlist[];
    previousVideo: Video;
    nextVideo: Video;
    codesLoaded: boolean;
    github?: string;
    firstLoading: boolean;
    activeTabKey: string;
    video: Video;
}

export interface IPropsWatchContext extends IState {
    history: RouteComponentProps['history'],
}

export const WatchContext = React.createContext<IPropsWatchContext>(null);

class Watch extends React.Component<IProps, IState> {


    constructor(props: IProps) {
        super(props);

        let query = queryString.parse(location.search);

        this.state = {
            videoId: query.v as string,
            playlistUuid: query.p as string,
            time: parseFloat(query.t as string),
            codesLoaded: false,
            firstLoading: true,
            playlists: [],
            nextVideo: undefined,
            previousVideo: undefined,
            activeTabKey: 'timeline',
            video: undefined,
        }

        props.updateLeftMenu({
            isWatchPage: true,
            justLeftMenu: true,
        });
    }

    setActiveTabKey = (activeTabKey: string) => {
        this.setState({ activeTabKey });
    }

    async componentWillReceiveProps(newProps: IProps) {
        let query = queryString.parse(location.search);
        if (newProps.isLogged !== this.props.isLogged) {
            await this.init();
            return;
        }
        // Set actual playlist if playlist uuid change in url
        if (query.p && query.p !== this.state.playlistUuid) {
            this.setPreviousAndNextVideoId(newProps.actualPlaylist.videos.find(video => video.videoId === this.state.videoId), newProps.actualPlaylist);
        }
        if (query.v && query.v !== this.state.videoId || (query.p && query.v && query.v !== this.state.videoId && query.p !== this.state.playlistUuid)) {
            await this.setState({ videoId: query.v as string, playlistUuid: query.p as string });
            await this.init();
        }
        if (this.props.loading === 1 && newProps.loading === 0) {
            this.props.hideLoading();
            if (this.state.firstLoading) this.setState({ firstLoading: false });
        }
    }

    async componentWillMount() {
        this.props.resetLoading();
        incrementLoading();
        await generateCorrespondanceLanguage();
        decrementLoading();
        await this.init();
    }

    async init() {
        await this.setState({ codesLoaded: false, });

        const { incrementLoading, decrementLoading, updateActiveCodeIndex, updateActiveEditCodeIndex, updateActualMonacoModel, updateActualPlaylist } = this.props;

        updateActualMonacoModel(null);
        updateActiveCodeIndex(null);
        updateActiveEditCodeIndex(null);
        updateActualPlaylist(null);

        let userUuid = null;

        // Get video info
        incrementLoading();
        try {
            const { data: video } = await getVideoInfo(this.state.videoId);
            document.title = video.title + " - Syncodéo";
            this.setState({ video, });
        } catch{ }
        decrementLoading();

        // Watch informations
        incrementLoading();
        try {
            const { data: watchInfo } = await getWatchInfo(this.state.videoId, { notShowErrors: ['E-400-11'] });
            this.props.updateItsMyVideo(watchInfo.editable);
            this.props.replaceAllCodes(watchInfo.codes);
            this.props.updateUserUuid(watchInfo.owner);
            userUuid = watchInfo.owner;
            this.downloadFileForCodes();
            await this.setState({ github: watchInfo.github });
            this.props.updateLeftMenu({
                isWatchPage: true,
                justLeftMenu: true,
                haveGithubLink: watchInfo.github !== "",
            });
        } catch (error) {
            if (error.response && (error.response.status === 404 || error.response.status === 400)) {
                this.props.setShow404();
            }
        }
        decrementLoading();

        // Pour les playlists
        incrementLoading();
        try {
            const { data: playlists } = await getPlaylistFromUser(userUuid, { notShowErrors: ["E-400-11"] });
            await this.setState({ playlists: playlists.filter(playlist => playlist.videos.filter(v => v.videoId === this.state.videoId).length > 0) });
            const actualPlaylist = playlists.find(playlist => playlist.uuid === this.state.playlistUuid);
            await this.props.updateActualPlaylist(actualPlaylist);
            this.setPreviousAndNextVideoId(actualPlaylist.videos.find(video => video.videoId === this.state.videoId), actualPlaylist);
        } catch{
            this.props.updateActualPlaylist(null);
        }
        decrementLoading();

        await this.setState({ codesLoaded: true, });
    }

    setPreviousAndNextVideoId = (actualVideo: Video, actualPlaylist: Playlist) => {
        const indexOf = actualPlaylist.videos.indexOf(actualVideo);
        const previousVideo = (indexOf === 0 || indexOf === -1) ? undefined : actualPlaylist.videos[indexOf - 1];
        const nextVideo = (indexOf === actualPlaylist.videos.length - 1 || indexOf === -1) ? undefined : actualPlaylist.videos[indexOf + 1];
        this.setState({ previousVideo: previousVideo, nextVideo: nextVideo });
    }

    renderCodeBlockWithContext = (tabs: boolean) => (
        <WatchContext.Consumer>
            {context => (
                <CodeBlocks {...context} tabs={tabs} setActiveTabKey={this.setActiveTabKey} />
            )}
        </WatchContext.Consumer>
    )

    render() {
        const { actualLayout, route } = this.props;
        const { videoId, time, github, playlistUuid, codesLoaded, firstLoading, activeTabKey, video } = this.state;
        const paneStyle: CSSProperties = { position: 'relative', display: 'block', width: '100%', height: '100%', overflow: 'hidden', background: 'white' };

        return (
            <div id="watch">
                <SplitPane className="split-pane" split="vertical" defaultSize={'66.6%'} style={{ display: firstLoading ? 'none' : 'flex', overflow: 'hidden' }}>
                    <SplitPane paneStyle={{ ...paneStyle, overflow: 'hidden' }} className="split-pane" split="horizontal" defaultSize={'50%'}>
                        <YouTube videoId={videoId} time={time} />
                        <MonacoEditor codesLoaded={codesLoaded} />
                    </SplitPane>

                    <WatchContext.Provider value={{
                        ...this.state,
                        history: route.history,
                    }}>

                        {actualLayout === "layout-1" && github && (
                            <SplitPane className="split-pane" paneStyle={paneStyle} split="horizontal" defaultSize={'50%'}>
                                {this.renderCodeBlockWithContext(false)}
                                <Explorer github={github} />
                            </SplitPane>
                        )}

                        {actualLayout === "layout-2" && github && (
                            <SplitPane className="split-pane" defaultSize={'100%'} paneStyle={paneStyle} resizerStyle={{ pointerEvents: 'none' }}>
                                {this.renderCodeBlockWithContext(true)}
                                <></>
                            </SplitPane>
                        )}

                        {!github && (
                            <SplitPane className="split-pane" defaultSize={'100%'} paneStyle={paneStyle} resizerStyle={{ pointerEvents: 'none' }}>
                                {this.renderCodeBlockWithContext(true)}
                                <></>
                            </SplitPane>
                        )}}
                    </WatchContext.Provider>
                </SplitPane>
            </div>
        )
    }

    downloadFileForCodes = () => {
        for (let code of this.props.codes) {
            if (code.github.user) {
                downloadFile(generateDownloadUrl(code.github)).then(response => {
                    MonacoController.updateCodeModel(code.uuid, response.data, code.mode, true);
                    this.props.updateCode({ value: response.data, }, this.props.codes.indexOf(code));
                });
            }
        }
    }
}

interface IStateToProps {
    codes: IStateStore['codes'];
    isLogged: IStateStore['isLogged'];
    loading: IStateStore['loading'];
    actualLayout: IStateStore['actualLayout'];
    actualPlaylist: IStateStore['actualPlaylist'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        codes: state.codes,
        isLogged: state.isLogged,
        loading: state.loading,
        actualLayout: state.actualLayout,
        actualPlaylist: state.actualPlaylist,
    }
};

interface IDispatchToProps {
    incrementLoading: ILoadingAction['incrementLoading'];
    decrementLoading: ILoadingAction['decrementLoading'];
    resetLoading: ILoadingAction['resetLoading'];
    updateItsMyVideo: IItsMyVideoAction['updateItsMyVideo'];
    updateCode: ICodesAction['updateCode'];
    replaceAllCodes: ICodesAction['replaceAllCodes'];
    updateActiveCodeIndex: IActiveCodeIndexAction['updateActiveCodeIndex'];
    updateActiveEditCodeIndex: IActiveEditCodeIndexAction['updateActiveEditCodeIndex'];
    updateUserUuid: IUserUuidAction['updateUserUuid'];
    updateActualMonacoModel: IActualMonacoModelAction['updateActualMonacoModel'];
    updateLeftMenu: ILeftMenuAction['updateLeftMenu'];
    updateActualPlaylist: IActualPlaylistAction['updateActualPlaylist'];
    setShow404: IShow404Action['setShow404'];
    hideLoading: typeof hideLoading;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        incrementLoading: bindActionCreators(incrementLoading, dispatch),
        decrementLoading: bindActionCreators(decrementLoading, dispatch),
        resetLoading: bindActionCreators(resetLoading, dispatch),
        replaceAllCodes: bindActionCreators(replaceAllCodes, dispatch),
        updateItsMyVideo: bindActionCreators(updateItsMyVideo, dispatch),
        updateCode: bindActionCreators(updateCode, dispatch),
        updateActiveCodeIndex: bindActionCreators(updateActiveCodeIndex, dispatch),
        updateActiveEditCodeIndex: bindActionCreators(updateActiveEditCodeIndex, dispatch),
        updateUserUuid: bindActionCreators(updateUserUuid, dispatch),
        updateActualMonacoModel: bindActionCreators(updateActualMonacoModel, dispatch),
        updateLeftMenu: bindActionCreators(updateLeftMenu, dispatch),
        updateActualPlaylist: bindActionCreators(updateActualPlaylist, dispatch),
        setShow404: bindActionCreators(setShow404, dispatch),
        hideLoading: bindActionCreators(hideLoading, dispatch),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Watch);