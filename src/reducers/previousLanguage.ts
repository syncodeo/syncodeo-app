import { UPDATE_PREVIOUS_LANGUAGE } from '../constants/store';

export default function reducer(state = 'plaintext', action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_PREVIOUS_LANGUAGE:
            return action.language;
    }
}