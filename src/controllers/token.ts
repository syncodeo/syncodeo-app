import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/localStorage';
import EventEmitter from 'events';

export const removeTokenEmitter: EventEmitter = new EventEmitter();

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN);
}

export function getUuidFromToken() {
    const jwtDecoded = jwt.decode(localStorage.getItem(ACCESS_TOKEN) as string) as any;
    return jwtDecoded ? jwtDecoded.uuid : undefined;
}

export function deleteToken() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    removeTokenEmitter.emit('isSignedOut');
}

export function setTokens(accessToken: string, refreshToken: string, accessTokenExpiresIn: number) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    localStorage.setItem('expiresIn', (Date.now() + ((accessTokenExpiresIn - 30) * 1000)) + "");
}

export function isLogged() {
    return localStorage.getItem(ACCESS_TOKEN) !== null && localStorage.getItem(REFRESH_TOKEN) !== null && localStorage.getItem('device') !== null;
}