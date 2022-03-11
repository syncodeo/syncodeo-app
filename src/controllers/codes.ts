import Code from '../interfaces/Code';
import { request } from '../helpers/requests';
import translate from '../localization';
import { AxiosPromise } from 'axios';

export function canAddCode(codes: Code[], time: number) {
    // Pourcours la liste des codes
    for (let code of codes) {
        if (code.time === Math.floor(time)) throw new Error("You can't add a code in the same time than another !");
    }
}

export function sendCodeToBDD(code: Code, videoId: string, codeuuid: string) {
    // UPDATE le code
    if (codeuuid) {
        return request({
            url: 'videos/' + videoId + '/codes/' + codeuuid,
            method: 'PUT',
            
            data: {
                title: code.title,
                value: code.value,
                mode: code.mode,
            }
        });
    }
    // INSERT le code
    else {
        return request({
            url: 'videos/' + videoId + '/codes',
            method: 'POST',
            
            data: {
                title: code.title,
                value: code.value,
                mode: code.mode,
                time: code.time ? Math.floor(code.time) : 0,
            }
        });
    }
}

export function insertCode(time: number, videoId: string, previousLanguage: string) {
    return request({
        url: 'videos/' + videoId + '/codes',
        method: 'POST',
        
        data: {
            title: 'New code',
            value: translate('pasteCodeHere'),
            mode: previousLanguage,
            time,
            githubLink: '',
        }
    })
}

export function updateCodeBDD(code: Code, videoId: string, codeuuid: string): Promise<{ data: Code }> {
    return request({
        url: 'videos/' + videoId + '/codes/' + codeuuid,
        method: 'PUT',
        
        data: code,
    })
}

export function deleteCodeInBDD(videoId: string, codeuuid: string) {
    return request({
        url: 'videos/' + videoId + '/codes/' + codeuuid,
        method: 'DELETE',
        
    })
}