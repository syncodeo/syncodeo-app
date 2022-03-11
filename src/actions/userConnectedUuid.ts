import { UPDATE_USER_CONNECTED_UUID } from '../constants/store';
import { Dispatch, AnyAction } from 'redux';

export interface IUserConnectedUuidAction{
    updateUserConnectedUuid(userUuid: string);
}

export function updateUserConnectedUuid(userUuid: string){
    return (dispatch: Dispatch) => {
        dispatch({
            type: UPDATE_USER_CONNECTED_UUID,
            userUuid,
        });
    }
}