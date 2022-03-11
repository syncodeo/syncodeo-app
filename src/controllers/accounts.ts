import { request } from '../helpers/requests';

export function login(token: string): Promise<{
    data: {
        uuid: string;
        accessToken: string;
        refreshToken: string;
        accessTokenExpiresIn: number;
        linked: boolean;
    }
}> {
    return request({
        url: 'accounts/login',
        method: 'POST',
        data: {
            token,
            device: localStorage.getItem('device'),
        }
    });
}

export function isLinked(): Promise<{ data: { linked: boolean } }> {
    return request({
        url: 'accounts/me',
        method: 'GET',
        
    });
}

export function linkYoutubeAccount(): Promise<{ data: { channelId: string } }> {
    return window.gapi.auth2.getAuthInstance().grantOfflineAccess({
        scope: 'https://www.googleapis.com/auth/youtube.readonly'
    }).then((response: any) => {
        return request({
            url: 'accounts/linkYoutubeAccount',
            method: 'POST',
            
            data: { code: response.code, }
        });
    });
}