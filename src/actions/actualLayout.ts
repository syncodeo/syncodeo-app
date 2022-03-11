import { UPDATE_ACTUAL_LAYOUT } from '../constants/store';
import { Dispatch } from 'redux';

export interface IActualLayoutAction {
    updateActualLayout(actualLayout: 'layout-1' | 'layout-2');
}

export function updateActualLayout(actualLayout: 'layout-1' | 'layout-2') {
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_ACTUAL_LAYOUT,
            actualLayout,
        });
    }
}