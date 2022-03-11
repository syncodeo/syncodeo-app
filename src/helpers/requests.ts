import Axios from "axios";
import { getRefreshToken, getAccessToken, deleteToken, setTokens, isLogged } from "../controllers/token";
import { API_PATH } from "../constants/env";
import { message } from "antd";
import translate from "../localization";
import errorsServer from '../localization/en/en-us/errorsServer';

export interface IRequestOptions {
    url?: string,
    method?: 'POST' | 'GET' | 'DELETE' | 'PUT',
    data?: any;
    /**
     * Choose to not display this array of errors type
     */
    notShowErrors?: (keyof typeof errorsServer)[];
    /**
     * Override the catch on request function
     */
    onError?: () => void;
}

export function refreshToken() {
    return Axios({
        baseURL: API_PATH + 'accounts/refresh',
        method: 'POST',
        data: {
            refreshToken: getRefreshToken(),
            device: localStorage.getItem('device'),
        }
    }).then(response => {
        setTokens(response.data.accessToken, response.data.refreshToken, response.data.accessTokenExpiresIn);
    }).catch(error => {
        if (error.response.status === 400) deleteToken();
        if (process.env.NODE_ENV === 'development') console.log((error.response && error.response.data.message) || error.message);
    })
}

export function request(requestOptions: IRequestOptions): Promise<any> {
    let { url, method, data, onError, notShowErrors } = requestOptions;
    if(!notShowErrors) notShowErrors = ["E-400-11"];

    let headers = isLogged() ? { 'Authorization': getAccessToken() } : undefined;
    let axiosObject = {
        baseURL: API_PATH + url,
        method,
        data: method !== 'GET' ? data : undefined,
        params: method === 'GET' ? data : undefined,
        headers,
    }

    let promise = null;
    if (isLogged() && parseInt(localStorage.getItem('expiresIn')) <= Date.now()) {
        promise = refreshToken().then(() => Axios({ ...axiosObject, headers: { 'Authorization': getAccessToken() } }));
    } else {
        promise = Axios(axiosObject);
    }
    return promise.catch(async (error) => {
        if (onError) {
            onError();
        } else if (error.response) {
            if (error.response.status === 400 && !error.response.data.code && !notShowErrors.includes('E-400-00')) {
                message.error(translate('E-400-00'));
            } else if (error.response.status === 401 && !notShowErrors.includes('E-401-00')) {
                message.error(translate('E-401-00'));
            } else if (error.response.status === 429 && !notShowErrors.includes('E-429-00')) {
                message.error(translate('E-429-00'));
            } else if (!notShowErrors.includes(error.response.data.code)) {
                message.error(translate(error.response.data.code));
            }
        }
        if (process.env.NODE_ENV === 'development') console.log((error.response && error.response.data.message) || error.message);
        throw error;
    });
}