import { UPDATE_ACTUAL_PLAYLIST } from '../constants/store';
import { Playlist } from '../interfaces/Playlists';

export default function reducer(state: Playlist = null, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_ACTUAL_PLAYLIST:
            return action.actualPlaylist;
    }
}