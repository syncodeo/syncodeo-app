import { UPDATE_IS_MOBILE } from '../constants/store';

export default function reducer(state = false, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_IS_MOBILE:
            return action.isMobile;
    }
}