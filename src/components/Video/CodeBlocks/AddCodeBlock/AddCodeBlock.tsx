import './AddCodeBlock.less';

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { insertCode } from '../../../../controllers/codes';
import YouTubeController from '../../../../controllers/youtube';
import MonacoController from '../../../../controllers/monacoEditor';
import { Icon } from 'antd';
import { addCode, ICodesAction, } from '../../../../actions/codes';
import { DropTarget } from 'react-dnd';
import { updatePreviousLanguage, IPreviousLanguageAction } from '../../../../actions/previousLanguage';
import { IStateStore } from '../../../../interfaces/Store';

interface IProps extends IStateToProps, IDispatchToProps {
    canDrop?: boolean;
    isOver?: boolean;
    connectDropTarget?: any;
}

interface IState {

}

class AddCodeBlock extends React.Component<IProps, IState>{
    render() {
        const { canDrop, isOver, connectDropTarget, isLogged, itsMyVideo } = this.props;

        const codeBlock = (
            <li className="code-block">
                <svg className="svg-code-block placeholder" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polygon
                        className='svg-title active'
                        points="0,0 100,0 100,100 0,100"
                        fill={isOver ? 'green' : '#E7E7E7'}
                        onClick={() => {
                            insertCode(Math.floor(YouTubeController.playerCurrentTime), YouTubeController.videoId, this.props.previousLanguage).then(response => {
                                MonacoController.createModel(response.data.uuid, this.props.previousLanguage);
                                this.props.addCode(response.data);
                            });
                        }}
                    />
                </svg>
                <Icon className="add-icon" type={canDrop ? 'inbox' : 'plus'} />
            </li>
        )

        return (isLogged && itsMyVideo) ? connectDropTarget(codeBlock) : codeBlock
    }
}

interface IStateToProps {
    previousLanguage: IStateStore['previousLanguage'];
    isLogged: IStateStore['isLogged'];
    itsMyVideo: IStateStore['itsMyVideo'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        previousLanguage: state.previousLanguage,
        isLogged: state.isLogged,
        itsMyVideo: state.itsMyVideo,
    }
};

interface IDispatchToProps {
    addCode: ICodesAction['addCode'];
    updatePreviousLanguage: IPreviousLanguageAction['updatePreviousLanguage'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updatePreviousLanguage: bindActionCreators(updatePreviousLanguage, dispatch),
        addCode: bindActionCreators(addCode, dispatch),
    };
}

const target = {
    drop(props) {
        return { mode: "move", };
    },
    canDrop(props) {
        return true;
    },
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget<IProps>('item', target, collect)(AddCodeBlock));