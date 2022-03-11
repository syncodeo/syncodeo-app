import en_us from './en/en-us';
import fr_fr from './fr/fr-fr';
import _default, { I18n } from './default';

// index.js
const obj = {
    'default': _default,
    'en-us': en_us,
    'fr-fr': fr_fr,
};

export default function translate(id: keyof I18n, data?): string{
    let value = (obj[localStorage.getItem('localization')] || obj['default'])[id];
    if(value){
        return value.replace(/{{([^}]+)}}/gm, (_, content) => data[content]);
    }
    return id;
}