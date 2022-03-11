import { INCREMENT_LOADING, DECREMENT_LOADING, RESET_LOADING, } from '../constants/store';

export default function reducer(state = 0, action: any) {
    switch (action.type) {
        default:
            return state;

        case INCREMENT_LOADING:
            return state + 1;
        
        case DECREMENT_LOADING:
            return state - 1;

        case RESET_LOADING:
            return 0;
    }
}