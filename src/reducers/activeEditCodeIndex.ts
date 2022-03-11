import { UPDATE_ACTIVE_EDIT_CODE_INDEX } from '../constants/store';

export default function reducer(state = null, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_ACTIVE_EDIT_CODE_INDEX:
            return action.activeEditCodeIndex;
    }
}