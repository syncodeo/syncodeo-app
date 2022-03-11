import { UPDATE_IS_LOGGED } from '../constants/store';
import { isLogged } from '../controllers/token';

export default function reducer(state = isLogged(), action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_IS_LOGGED:
            return action.isLogged;
    }
}