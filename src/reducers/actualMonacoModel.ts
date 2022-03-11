import { UPDATE_ACTUAL_MONACO_MODEL } from '../constants/store';
import * as monaco from 'monaco-editor';

export default function reducer(state: monaco.editor.ITextModel = null, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_ACTUAL_MONACO_MODEL:
            return action.actualMonacoModel;
    }
}