import { request, IRequestOptions } from "../helpers/requests";
import { Playlist } from "../interfaces/Playlists";
import { getUuidFromToken } from "./token";
import Video from "../interfaces/Video";
import ISearch from "../interfaces/Search";

// ADD

export function addPlaylist(playlist: Playlist): Promise<{ data: Playlist }> {
    return request({
        url: 'playlists',
        method: 'POST',
        
        data: playlist
    });
}

export function addVideoToPlaylist(playlistUuid: string, videoId: string, requestOptions?: IRequestOptions) {
    return request({
        url: 'playlists/' + playlistUuid + '/videos/' + videoId,
        method: 'POST',
        
        ...requestOptions
    });
}

// EDIT

export function editPlaylist(uuid: string, playlist: Playlist): Promise<{ data: Playlist }> {
    return request({
        url: 'playlists/' + uuid,
        method: 'PUT',
        
        data: playlist,
    });
}

export function editRankVideoInPlaylist(playlistUuid: string, videoId: string, rank: number): Promise<{ data: Playlist }> {
    return request({
        url: 'playlists/' + playlistUuid + '/videos/' + videoId,
        method: 'PUT',
        
        data: { rank },
    });
}

// DELETE

export function deletePlaylist(uuid: string): Promise<any> {
    return request({
        url: 'playlists/' + uuid,
        method: 'DELETE',
    });
}

export function deleteVideoOnPlaylist(playlistUuid: string, videoId: string): Promise<any> {
    return request({
        url: 'playlists/' + playlistUuid + '/videos/' + videoId,
        method: 'DELETE',
    });
}

// GET

export function getPlaylistFromUser(uuid: string, requestOptions?: IRequestOptions): Promise<{ data: Playlist[] }> {
    return request({
        url: 'users/' + uuid + '/playlists',
        method: 'GET',
        ...requestOptions,
    });
}

export function getPlaylistsFromUserConnected(): Promise<{ data: Playlist[] }> {
    return request({
        url: 'users/' + getUuidFromToken() + '/playlists',
        method: 'GET',
    });
}


export function getVideosFromPlaylist(uuid: string): Promise<{ data: Playlist }> {
    return request({
        url: 'playlists/' + uuid,
        method: 'GET',
    });
}

export function searchPlaylist(info: ISearch): Promise<{ data: { results: Playlist[], nextPage: number } }> {
    return request({
        url: 'playlists/search',
        method: 'GET',
        data: {
            query: info.query,
            difficulty: JSON.stringify(info.difficulty) || '',
            language: JSON.stringify(info.language) || '',
            page: info.page,
        }
    });
}