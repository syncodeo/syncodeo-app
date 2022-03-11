import * as TYPE from '../constants/store';
import { Dispatch } from 'redux';
import Code from '../interfaces/Code';

export interface ICodesAction{
    addCode(code: Code);
    updateCode(code: Code, index: number);
    deleteCode(index: number);
    saveCode(index: number);
    replaceAllCodes(codes: Code[]);
    moveCode(index: number, time: number)
}

export function addCode(code: Code) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: TYPE.ADD_CODE,
            code,
        });
    }
}

export function updateCode(code: Code, index: number) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: TYPE.UPDATE_CODE,
            code,
            index,
        });
    }
}

export function deleteCode(index: number) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: TYPE.DELETE_CODE,
            index,
        });
    }
}

export function saveCode(index: number) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: TYPE.SAVE_CODE,
            index,
        });
    }
}

export function replaceAllCodes(codes: Code[]) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: TYPE.REPLACE_ALL_CODES,
            codes,
        });
    }
}

export function moveCode(index: number, time: number){
    return (dispatch: Dispatch) => {
        dispatch({
            type: TYPE.MOVE_CODE,
            index,
            time,
        });
    }
}