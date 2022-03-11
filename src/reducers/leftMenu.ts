import { UPDATE_LEFT_MENU } from '../constants/store';
import { LeftMenu } from '../actions/leftMenu';

const initialLeftMenu: LeftMenu = {
    title: '',
    icon: '',
    justLeftMenu: false,
    isWatchPage: false,
    openFeedback: false,
    backIcon: false,
    removeLeftMenu: false,
    selectedKeys: [],
    haveGithubLink: false,
}

export default function reducer(state: LeftMenu = initialLeftMenu, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_LEFT_MENU:
            return { ...initialLeftMenu, ...action.leftMenu };
    }
}