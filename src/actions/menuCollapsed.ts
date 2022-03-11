import { UPDATE_MENU_COLLAPSED } from '../constants/store';
import { Dispatch } from 'redux';

export interface IMenuCollapsedAction{
    updateMenuCollapsed(menuCollapsed: boolean): void;
}

export function updateMenuCollapsed(menuCollapsed: boolean){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_MENU_COLLAPSED,
            menuCollapsed,
        });
    }
}