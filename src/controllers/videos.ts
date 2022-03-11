// Controllers
import { getUuidFromToken, isLogged, } from '../controllers/token';
// Interfaces
import Video from "../interfaces/Video";
import { request, IRequestOptions } from "../helpers/requests";
import ISearch from '../interfaces/Search';
import Code from '../interfaces/Code';

export function getVideosFromUserConnected(): Promise<{ data: Video[] }> {
    return request({
        url: 'users/' + getUuidFromToken() + '/videos',
        method: 'GET',

    });
}

export function getVideosFromUser(uuid: string): Promise<{ data: Video[] }> {
    return request({
        url: 'users/' + uuid + '/videos',
        method: 'GET',
    });
}

export function getVideosRecentlyUpdated(): Promise<{ data: Video[] }> {
    return request({
        url: 'videos/recentlyUpdated',
        method: 'GET',
    });
}

export function getVideosCollaboratives(): Promise<{ data: Video[] }> {
    return request({
        url: 'users/' + getUuidFromToken() + '/videos',
        method: 'GET',

        data: { collaborator: true, }
    });
}

export function getVideoInfoFromYoutube(videoId: string): Promise<{ data: Video }> {
    return request({
        url: 'videos/gather',
        method: 'GET',

        data: { videoId }
    });
}

export function getVideoInfo(videoId: string): Promise<{ data: Video }> {
    return request({
        url: 'videos/' + videoId,
        method: 'GET'
    });
}

export function getRecentVideoUploaded() {
    return request({
        url: 'videos/recentUploads',
        method: 'GET',

    });
}

export function getRecentlyVideoUpdated() {
    return request({
        url: 'videos/recentlyUpdated',
        method: 'GET',

    });
}

export function getWatchInfo(videoId: string, requestOptions?: IRequestOptions): Promise<{
    data: {
        github: string;
        editable: boolean;
        codes: Code[];
        owner: string;
    }
}> {
    return request({
        url: 'videos/' + videoId + '/watch',
        method: 'GET',
        ...requestOptions,
    });
}

export function addVideo(video: Video) {
    return request({
        url: 'videos',
        method: 'POST',
        data: video
    });
}

export function deleteVideo(videoId: string) {
    return request({
        url: 'videos/' + videoId,
        method: 'DELETE',
        data: { videoId }
    });
}

export function editVideo(videoId: string, video: Video, requestOptions?: IRequestOptions): Promise<{ data: Video }> {
    return request({
        url: 'videos/' + videoId,
        method: 'PUT',
        data: video,
        ...requestOptions
    });
}

export function searchVideo(info: ISearch): Promise<{ data: { results: Video[], nextPage: number } }> {
    return request({
        url: 'videos/search',
        method: 'GET',
        data: {
            query: info.query,
            difficulty: JSON.stringify(info.difficulty) || '',
            language: JSON.stringify(info.language) || '',
            page: info.page,
        }
    });
}