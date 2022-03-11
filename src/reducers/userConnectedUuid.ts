import { UPDATE_USER_CONNECTED_UUID } from '../constants/store';

export default function reducer(state = null, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_USER_CONNECTED_UUID:
            return action.userUuid;
    }
}