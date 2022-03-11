import { INCREMENT_LOADING, DECREMENT_LOADING, RESET_LOADING, } from '../constants/store';
import { Dispatch } from 'redux';

export interface ILoadingAction{
    incrementLoading(): void;
    decrementLoading(): void;
    resetLoading(): void;
}

export function incrementLoading() {
    return (dispatch: Dispatch) => {
        dispatch({
            type: INCREMENT_LOADING,
        });
    }
}

export function decrementLoading() {
    return (dispatch: Dispatch) => {
        dispatch({
            type: DECREMENT_LOADING,
        });
    }
}

export function resetLoading(){
    return (dispatch: Dispatch) => {
        dispatch({
            type: RESET_LOADING,
        });
    }
}