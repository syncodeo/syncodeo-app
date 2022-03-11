import './DeleteCodeBlock.less';

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ICodesAction, deleteCode } from '../../../../actions/codes';
import { DropTarget } from 'react-dnd';
import translate from '../../../../localization';

interface IProps extends IDispatchToProps {
    haveMenu: boolean;
    canDrop?: boolean;
    connectDropTarget?: any;
    isOver?: boolean;
}

interface IState {

}

class DeleteCodeBlock extends React.Component<IProps, IState>{
    render() {
        const { connectDropTarget, canDrop } = this.props;

        return (
            connectDropTarget(
                <div className="delete-section" style={{ height: canDrop ? 35 : 0, bottom: this.props.haveMenu ? null : 0, }}>
                    <h1 style={{ color: 'white', }}>{translate('delete').toUpperCase()}</h1>
                </div>
            )
        )
    }
}

interface IDispatchToProps {
    deleteCode: ICodesAction['deleteCode'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        deleteCode: bindActionCreators(deleteCode, dispatch),
    };
}

const target = {
    drop(props: IProps) {
        return { mode: "delete", };
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


export default connect(undefined, mapDispatchToProps)(DropTarget<IProps>('item', target, collect)(DeleteCodeBlock));