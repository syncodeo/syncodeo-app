import React from 'react';
import Code from '../../../interfaces/Code';
import YouTubeController from '../../../controllers/youtube';
import { languageToColor, languageToAlias } from '../../../controllers/languages';
import { Icon, Menu, Dropdown } from 'antd';
import { IStateStore } from '../../../interfaces/Store';
import { IActiveEditCodeIndexAction, updateActiveEditCodeIndex } from '../../../actions/activeEditCodeIndex';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DragSource } from 'react-dnd';
import { ICodesAction, deleteCode, moveCode } from '../../../actions/codes';
import { deleteCodeInBDD, updateCodeBDD } from '../../../controllers/codes';
import translate from '../../../localization';
import { copyToClipboard } from '../../../helpers/functions';
import YoutubeController from '../../../controllers/youtube';
import MonacoController from '../../../controllers/monacoEditor';
import { generateTreeUrl } from '../../../controllers/github';
import { IActualMonacoModelAction, updateActualMonacoModel } from '../../../actions/actualMonacoModel';

interface IProps extends IStateToProps, IDispatchToProps {
    index: number;
    pourcentage?: number;
    connectDragSource?: any;
    component?: any;
    isDragging?: boolean;
    code: Code;
}

interface IState {

}

class CodeBlockDraggable extends React.Component<IProps, IState>{

    render() {
        const {
            activeCodeIndex,
            index,
            activeEditCodeIndex,
            itsMyVideo,
            isLogged,
            updateActiveEditCodeIndex,
            pourcentage,
            connectDragSource,
            isDragging,
            code,
        } = this.props;
        const minute = Math.floor(code.time / 60);
        const second = code.time - minute * 60;

        const menu = (
            <Menu>
                <Menu.Item onClick={param => {
                    param.domEvent.stopPropagation();
                    copyToClipboard('https://syncodeo.io/watch?v=' + YoutubeController.videoId + '&t=' + code.time);
                }}>
                    <span><Icon type="share-alt" /> {translate('shareCodeVideo')}</span>
                </Menu.Item>
                {code.github.user && (
                    <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href={generateTreeUrl(code.github)}><Icon type="github" /> {translate('openFileGithub')}</a>
                    </Menu.Item>
                )}
            </Menu>
        )

        const UpToDate = <li>{translate('upToDate')} <Icon type="check" /></li>
        const Saving = <li>{translate('saving')} <Icon type="loading" /></li>
        const Github = <li>{translate('github')} <Icon type="github" /></li>

        const codeBlock = (
            <li className="code-block" style={{ opacity: isDragging ? 0 : 1 }}>
                <svg className="svg-code-block" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polygon
                        className={activeCodeIndex == index ? 'svg-title active' : 'svg-title'}
                        points="0,0 60,0 70,100 0,100"
                        fill="#E7E7E7"
                        onClick={() => {
                            this.props.updateActualMonacoModel(MonacoController.models[this.props.code.uuid].model);
                            YouTubeController.seekTo(code.time)
                        }}
                    />
                    <polygon
                        className={activeEditCodeIndex === index ? 'svg-langauge active' : 'svg-langauge'}
                        points="60,0 100,0 100,100 70,100"
                        fill={languageToColor(code.mode)}
                        onClick={isLogged && itsMyVideo ? () => updateActiveEditCodeIndex(activeEditCodeIndex === index ? null : index) : null}
                    />
                </svg>
                <h3 className="title">{code.title}</h3>
                <h5 className="time">
                    {minute.toString().length === 1 ? "0" + minute : minute}:{second.toString().length === 1 ? "0" + second : second}
                    {pourcentage !== undefined && <span> - {pourcentage.toString()}%</span>}
                </h5>
                <ul className="icons">
                    {code.github && code.github.user && Github}
                    {code.github && !code.github.user && isLogged && itsMyVideo && (
                        <b>{code.upToDate === undefined ? UpToDate : code.upToDate ? UpToDate : Saving}</b>
                    )}
                </ul>
                <span className="language-name">{languageToAlias(code.mode)}</span>
            </li>
        )

        return (
            <Dropdown overlay={menu} trigger={['contextMenu']} >
                {(isLogged && itsMyVideo) ? connectDragSource(codeBlock) : codeBlock}
            </Dropdown >
        )
    }
}

interface IStateToProps {
    codes: IStateStore['codes'];
    activeCodeIndex: IStateStore['activeCodeIndex'];
    activeEditCodeIndex: IStateStore['activeEditCodeIndex'];
    actualMonacoModel: IStateStore['actualMonacoModel'];
    isLogged: IStateStore['isLogged'];
    itsMyVideo: IStateStore['itsMyVideo'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        codes: state.codes,
        activeEditCodeIndex: state.activeEditCodeIndex,
        activeCodeIndex: state.activeCodeIndex,
        actualMonacoModel: state.actualMonacoModel,
        isLogged: state.isLogged,
        itsMyVideo: state.itsMyVideo,
    };
};

interface IDispatchToProps {
    updateActiveEditCodeIndex: IActiveEditCodeIndexAction['updateActiveEditCodeIndex'];
    updateActualMonacoModel: IActualMonacoModelAction['updateActualMonacoModel'];
    deleteCode: ICodesAction['deleteCode'],
    moveCode: ICodesAction['moveCode'],
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateActiveEditCodeIndex: bindActionCreators(updateActiveEditCodeIndex, dispatch),
        updateActualMonacoModel: bindActionCreators(updateActualMonacoModel, dispatch),
        deleteCode: bindActionCreators(deleteCode, dispatch),
        moveCode: bindActionCreators(moveCode, dispatch),
    };
}

const source = {
    beginDrag(props: IProps) {
        props.updateActiveEditCodeIndex(null);
        return {};
    },
    endDrag(props: IProps, monitor, component) {
        if (!monitor.didDrop()) return;

        if (monitor.getDropResult().mode === 'delete') {
            deleteCodeInBDD(YouTubeController.videoId, props.code.uuid).then(response => {
                MonacoController.deleteModel(props.code.uuid);
                props.deleteCode(props.index);
            });
        }
        else {
            updateCodeBDD({ time: Math.floor(YouTubeController.playerCurrentTime) }, YouTubeController.videoId, props.code.uuid).then(response => {
                props.moveCode(props.index, Math.floor(YouTubeController.playerCurrentTime));
            });
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DragSource('item', source, collect)(CodeBlockDraggable));