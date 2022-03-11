import { UPDATE_ITS_MY_VIDEO } from '../constants/store';

export default function reducer(state = false, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_ITS_MY_VIDEO:
            return action.itsMyVideo;
    }
}