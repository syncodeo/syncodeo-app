import { UPDATE_ITS_MY_VIDEO } from '../constants/store';

export interface IItsMyVideoAction{
    updateItsMyVideo(itsMyVideo: boolean): void;
}

export function updateItsMyVideo(itsMyVideo: boolean){
    return (dispatch: any) => {
        dispatch({
            type: UPDATE_ITS_MY_VIDEO,
            itsMyVideo,
        });
    }
}