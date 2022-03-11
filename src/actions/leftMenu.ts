import { UPDATE_LEFT_MENU } from '../constants/store';
import { Dispatch } from 'redux';

export interface LeftMenu{
    title?: string;
    icon?: string;
    selectedKeys?: string[];
    isWatchPage?: boolean;
    openFeedback?: boolean;
    justLeftMenu?: boolean;
    backIcon?: boolean;
    removeLeftMenu?: boolean;
    haveGithubLink?: boolean;
}

export interface ILeftMenuAction{
    updateLeftMenu(leftMenu: LeftMenu);
}

export function updateLeftMenu(leftMenu: LeftMenu){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_LEFT_MENU,
            leftMenu,
        });
    }
}