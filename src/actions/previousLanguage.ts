import { UPDATE_PREVIOUS_LANGUAGE } from '../constants/store';
import { Dispatch } from 'redux';

export interface IPreviousLanguageAction{
    updatePreviousLanguage(language: string);
}

export function updatePreviousLanguage(language: string){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_PREVIOUS_LANGUAGE,
            language,
        });
    }
}