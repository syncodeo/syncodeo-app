import { UPDATE_ACTUAL_MONACO_MODEL } from '../constants/store';
import { Dispatch } from 'redux';
import { IStateStore } from '../interfaces/Store';

export interface IActualMonacoModelAction {
    updateActualMonacoModel(actualMonacoModel: IStateStore['actualMonacoModel']);
}

export function updateActualMonacoModel(actualMonacoModel: IStateStore['actualMonacoModel']) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_ACTUAL_MONACO_MODEL,
            actualMonacoModel,
        });
    }
}