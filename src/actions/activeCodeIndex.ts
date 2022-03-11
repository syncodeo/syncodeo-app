import { UPDATE_ACTIVE_CODE_INDEX } from '../constants/store';
import { Dispatch } from 'redux';

export interface IActiveCodeIndexAction{
    updateActiveCodeIndex(activeCodeIndex: number);
}

export function updateActiveCodeIndex(activeCodeIndex: number){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_ACTIVE_CODE_INDEX,
            activeCodeIndex,
        });
    }
}