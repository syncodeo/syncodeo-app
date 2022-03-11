import { UPDATE_SHOW_404 } from '../constants/store';
import { Dispatch } from 'redux';

export interface IShow404Action{
    setShow404: () => void;
    resetShow404: () => void;
}

export function setShow404(){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_SHOW_404,
            show404: true,
        });
    }
}

export function resetShow404(){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_SHOW_404,
            show404: false,
        });
    }
}