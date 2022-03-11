import { UPDATE_ACTUAL_PLAYLIST } from '../constants/store';
import { Dispatch } from 'redux';
import { IStateStore } from '../interfaces/Store';

export interface IActualPlaylistAction {
    updateActualPlaylist(actualPlaylist: IStateStore['actualPlaylist']);
}

export function updateActualPlaylist(actualPlaylist: IStateStore['actualPlaylist']) {
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_ACTUAL_PLAYLIST,
            actualPlaylist,
        });
    }
}