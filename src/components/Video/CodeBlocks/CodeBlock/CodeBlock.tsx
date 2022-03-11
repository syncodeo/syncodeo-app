import './CodeBlock.less';

// React & Redux
import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

// Actions
import { ICodesAction, deleteCode, } from '../../../../actions/codes';

// Interfaces
import Code from '../../../../interfaces/Code';
import { IStateStore } from '../../../../interfaces/Store';

import AddCodeBlock from '../AddCodeBlock/AddCodeBlock';
import EditCodeBlock from './EditCodeBlock/EditCodeBlock';
import { IActiveEditCodeIndexAction, updateActiveEditCodeIndex } from '../../../../actions/activeEditCodeIndex';
import CodeBlockDraggable from '../CodeBlockDraggable';


interface IProps extends IStateToProps, IDispatchToProps {
    index: number;
    code: Code;
    playerCurrentTime: number;
    pourcentage?: number;
}

interface IState { }

class CodeBlock extends React.Component<IProps, IState> {

    render() {
        const { code, index, isLogged, itsMyVideo, pourcentage, } = this.props;

        return (
            <>
                {<CodeBlockDraggable code={code} index={index} pourcentage={pourcentage} />}

                {isLogged && itsMyVideo && <EditCodeBlock codeIndex={index} code={code} />}

                {/* Add code */}
                {isLogged && itsMyVideo && code.time !== this.props.playerCurrentTime && this.props.activeCodeIndex == this.props.index && <AddCodeBlock />}
            </>
        )
    }
}

interface IStateToProps {
    activeCodeIndex: IStateStore['activeCodeIndex'];
    activeEditCodeIndex: IStateStore['activeEditCodeIndex'];
    isLogged: IStateStore['isLogged'];
    itsMyVideo: IStateStore['itsMyVideo'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        activeEditCodeIndex: state.activeEditCodeIndex,
        activeCodeIndex: state.activeCodeIndex,
        isLogged: state.isLogged,
        itsMyVideo: state.itsMyVideo,
    };
};

interface IDispatchToProps {
    deleteCode: ICodesAction['deleteCode'];
    updateActiveEditCodeIndex: IActiveEditCodeIndexAction['updateActiveEditCodeIndex'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteCode: bindActionCreators(deleteCode, dispatch),
        updateActiveEditCodeIndex: bindActionCreators(updateActiveEditCodeIndex, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeBlock);