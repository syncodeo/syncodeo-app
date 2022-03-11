import Axios from 'axios';
import { REGEX_GITHUB, } from '../constants/regex';
import Code from '../interfaces/Code';

export function getGithubRepoFiles(link: string, path?: string) {
    let files = [];
    const infos = link.match(REGEX_GITHUB);
    let newLink = `https://api.github.com/repos/${infos[1]}/${infos[2]}/contents`;
    if (infos[4] && !path) newLink += '/' + infos[4];
    if (path) newLink += '/' + path;
    if (infos[3]) newLink += '?ref=' + infos[3];

    return new Promise((resolve, reject) => {
        Axios({
            baseURL: newLink,
            method: 'GET',
        }).then(response => {
            for (let file of response.data) {
                files.push({
                    title: file.name,
                    key: file.sha,
                    branch: infos[3] || 'master',
                    path: file.path,
                    extension: file.name.split('.').pop(),
                    content: null,
                    download_url: file.download_url,
                    isLeaf: file.type === 'file',
                });
            }
            resolve(files);
        }).catch(error => reject(error));
    });
}

export function generateTreeUrl(github: Code['github']) {
    return `https://github.com/${github.user}/${github.repository}/blob/${github.branch}/${github.path}`;
}

export function generateDownloadUrl(github: Code['github']) {
    return `https://raw.githubusercontent.com/${github.user}/${github.repository}/${github.branch}/${github.path}`;
}

export function explodeCodeGitHub(link: string) {
    let match = link.match(REGEX_GITHUB);
    return {
        user: match[1],
        repository: match[2],
        branch: match[3],
        path: match[4],
    }
}

export function downloadFile(url: string): Promise<{ data: any, headers: any }> {
    return Axios({
        baseURL: url,
        method: 'GET',
        responseType: 'text',
        transformResponse: undefined,
    });
}