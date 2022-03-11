import { UPDATE_ACTIVE_EDIT_CODE_INDEX } from '../constants/store';
import { Dispatch } from 'redux';

export interface IActiveEditCodeIndexAction{
    updateActiveEditCodeIndex(activeEditCodeIndex: number);
}

export function updateActiveEditCodeIndex(activeEditCodeIndex: number){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_ACTIVE_EDIT_CODE_INDEX,
            activeEditCodeIndex,
        });
    }
}