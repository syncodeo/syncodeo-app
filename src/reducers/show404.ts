import { UPDATE_SHOW_404 } from '../constants/store';

export default function reducer(state = false, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_SHOW_404:
            return action.show404;
    }
}