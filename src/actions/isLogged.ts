import { UPDATE_IS_LOGGED } from '../constants/store';
import { isLogged } from '../controllers/token';

export interface IIsLoggedAction{
    updateIsLogged(): void;
}

export function updateIsLogged(){
    return (dispatch: any) => {
        dispatch({
            type: UPDATE_IS_LOGGED,
            isLogged: isLogged(),
        });
    }
}