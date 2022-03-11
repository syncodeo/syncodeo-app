import { UPDATE_MENU_COLLAPSED } from '../constants/store';

export default function reducer(state = localStorage.getItem('menuCollapsed') !== null, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_MENU_COLLAPSED:
            localStorage.setItem('menuCollapsed', action.menuCollapsed);
            return action.menuCollapsed;
    }
}