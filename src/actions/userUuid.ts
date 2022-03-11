import { UPDATE_USER_UUID } from '../constants/store';
import { Dispatch } from 'redux';

export interface IUserUuidAction{
    updateUserUuid(userUuid: string);
}

export function updateUserUuid(userUuid: string){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_USER_UUID,
            userUuid,
        });
    }
}