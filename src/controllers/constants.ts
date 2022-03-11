import { request } from "../helpers/requests";

export function getLocalizations(): Promise<{ data: string[] }> {
    return request({
        url: 'constants/localizations',
        method: 'GET'
    });
}

export function getDifficulties(): Promise<{ data: string[] }> {
    return request({
        url: 'constants/difficulties',
        method: 'GET'
    });
}