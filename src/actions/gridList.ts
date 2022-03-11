import { UPDATE_GRID_LIST } from '../constants/store';
import { Dispatch } from 'redux';

export interface IGridListAction{
    updateGridList(gridList: boolean);
}

export function updateGridList(gridList: boolean){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_GRID_LIST,
            gridList,
        });
    }
}