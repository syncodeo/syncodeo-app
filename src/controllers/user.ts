import { request } from "../helpers/requests";
import { User } from "../interfaces/User";

export const getUserInfo = (uuid: string): Promise<{ data: User }> => {
    return request({
        url: 'users/' + uuid,
        method: 'GET',
    });
}