import * as TYPE from '../constants/store';
import { AnyAction } from 'redux';
import Code from '../interfaces/Code';

interface CodesAction extends AnyAction {
    index: number;
    code: Code,
    codes: Code[];
    time: number;
}

export default function reducer(state: Code[] = [], action: CodesAction) {
    let array: Code[];

    switch (action.type) {
        default:
            return [...state];

        case TYPE.ADD_CODE:
            array = [...state];
            array.push(action.code);
            array.sort((a: Code, b: Code) => a.time - b.time);
            return [...array];

        case TYPE.REPLACE_ALL_CODES:
            return [...action.codes];

        case TYPE.UPDATE_CODE:
            return Object.assign([...state], {
                [action.index]: {
                    ...state[action.index],
                    ...action.code,
                }
            });

        case TYPE.DELETE_CODE:
            array = [...state];
            array.splice(action.index, 1);
            return [...array];

        case TYPE.MOVE_CODE:
            array = [...state];
            array[action.index].time = action.time;
            array.sort((a: Code, b: Code) => a.time - b.time);
            return [...array];
    }
}