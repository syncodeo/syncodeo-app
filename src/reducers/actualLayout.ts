import { UPDATE_ACTUAL_LAYOUT } from '../constants/store';
import { AnyAction } from 'redux';

interface IActualLayoutAction extends AnyAction {
    actualLayout: 'layout-1' | 'layout-2';
}

export default function reducer(
        state: IActualLayoutAction['actualLayout'] = localStorage.getItem('layout') as IActualLayoutAction['actualLayout'] || 'layout-1',
        action: IActualLayoutAction
    ) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_ACTUAL_LAYOUT:
            localStorage.setItem('layout', action.actualLayout);
            return action.actualLayout;
    }
}