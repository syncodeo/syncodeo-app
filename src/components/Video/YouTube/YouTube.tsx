import './YouTube.css';

// React & Redux
import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from "react-redux";

// Actions
import { updateActiveCodeIndex, IActiveCodeIndexAction } from '../../../actions/activeCodeIndex';
import { incrementLoading, decrementLoading, ILoadingAction, } from '../../../actions/loading';

// Components
import Youtube from 'react-youtube';

// Controllers
import YouTubeController from '../../../controllers/youtube';
import MonacoEditorController from '../../../controllers/monacoEditor';
import { IStateStore } from '../../../interfaces/Store';
import { IActualMonacoModelAction, updateActualMonacoModel } from '../../../actions/actualMonacoModel';
import translate from '../../../localization';
import { ICodesAction, updateCode } from '../../../actions/codes';

interface IProps extends IStateToProps, IDispatchToProps {
    videoId: string;
    time?: number;
}

interface IState {

}

class YouTube extends React.Component<IProps, IState> {

    interval: any;
    activeCodeIndex: number | null = null;

    constructor(props: any) {
        super(props);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentWillMount() {
        YouTubeController.clear();
        this.props.incrementLoading();
    }

    render() {
        return (
            <>
                <Youtube
                    videoId={this.props.videoId}
                    opts={{
                        height: '100%',
                        width: '100%',
                        playerVars: {
                            start: this.props.time || 0,
                            autoplay: 1,
                            rel: 0,
                        },
                    }}
                    containerClassName="youtube"
                    onReady={event => {
                        YouTubeController.videoId = this.props.videoId;
                        YouTubeController.player = event.target;
                        YouTubeController.duration = event.target.getDuration();

                        this.interval = setInterval(() => {
                            YouTubeController.playerCurrentTime = event.target.getCurrentTime();

                            const { codes, activeCodeIndex, updateActiveCodeIndex, actualMonacoModel, updateActualMonacoModel, isLogged, itsMyVideo, } = this.props;

                            this.activeCodeIndex = null;
                            if (codes.length > 0 && codes[0].time <= event.target.getCurrentTime()) {
                                for (let index = codes.length - 1; index >= 0; index--) {
                                    const code = codes[index];
                                    if (code.time <= event.target.getCurrentTime()) {
                                        this.activeCodeIndex = index;
                                        break;
                                    }
                                }
                                if (this.activeCodeIndex === null) this.props.updateActiveCodeIndex(null);
                            }

                            // eslint-disable-next-line
                            if (activeCodeIndex != this.activeCodeIndex) {
                                updateActiveCodeIndex(this.activeCodeIndex);

                                if (actualMonacoModel !== MonacoEditorController.githubModel) {
                                    if (activeCodeIndex !== null) {
                                        const code = codes[this.activeCodeIndex];

                                        if (code) this.props.updateActualMonacoModel(MonacoEditorController.models[code.uuid].model);
                                    }
                                    else {
                                        this.props.updateActualMonacoModel(MonacoEditorController.emptyModel);
                                    }
                                }
                            }

                            YouTubeController.youtubeEventEmitter.emit('playerCurrentTime', event.target.getCurrentTime());
                        }, 200);

                        this.props.decrementLoading();
                    }}
                />
            </>
        )
    }
}

interface IStateToProps {
    isLogged: IStateStore['isLogged'];
    itsMyVideo: IStateStore['itsMyVideo'];
    codes: IStateStore['codes'];
    activeCodeIndex: IStateStore['activeCodeIndex'];
    actualMonacoModel: IStateStore['actualMonacoModel'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        isLogged: state.isLogged,
        itsMyVideo: state.itsMyVideo,
        codes: state.codes,
        activeCodeIndex: state.activeCodeIndex,
        actualMonacoModel: state.actualMonacoModel,
    };
};

interface IDispatchToProps {
    updateActiveCodeIndex: IActiveCodeIndexAction['updateActiveCodeIndex'];
    incrementLoading: ILoadingAction['incrementLoading'];
    decrementLoading: ILoadingAction['decrementLoading'];
    updateActualMonacoModel: IActualMonacoModelAction['updateActualMonacoModel'];
    updateCode: ICodesAction['updateCode'];
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        updateActiveCodeIndex: bindActionCreators(updateActiveCodeIndex, dispatch),
        incrementLoading: bindActionCreators(incrementLoading, dispatch),
        decrementLoading: bindActionCreators(decrementLoading, dispatch),
        updateActualMonacoModel: bindActionCreators(updateActualMonacoModel, dispatch),
        updateCode: bindActionCreators(updateCode, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(YouTube);