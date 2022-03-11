import { UPDATE_GRID_LIST } from '../constants/store';

export default function reducer(state = localStorage.getItem('gridList') !== null, action: any) {
    switch (action.type) {
        default:
            return state;

        case UPDATE_GRID_LIST:
            if(action.gridList){
                localStorage.setItem('gridList', 'true');
            }else{
                localStorage.removeItem('gridList');
            }
            return action.gridList;
    }
}