import * as monaco from 'monaco-editor';

const correspondance = {}
const color = [
    "#6a6ae8",
    "#778899",
    "#6b6bf9",
    "#FFE4E1",
    "#008B8B",
    "#1E90FF",
    "#9ACD32",
    "#B22222",
    "#F8F8FF",
    "#F0FFF0",
    "#3838ea",
    "#FFFAFA",
    "#48D1CC",
    "#afafdb",
    "#008000",
    "#7CFC00",
    "#8A2BE2",
    "#C0C0C0",
    "#FFDEAD",
    "#FFF8DC",
    "#FF0000",
    "#FF6347",
    "#7CFC00",
    "#DDA0DD",
    "#DC143C",
    "#E0FFFF",
    "#4B0082",
    "#DEB887",
    "#FFFFF0",
    "#800000",
    "#FFA500",
    "#00FFFF",
    "#BDB76B",
    "#DCDCDC",
    "#D3D3D3",
    "#ADFF2F",
    "#B0C4DE",
    "#66CDAA",
    "#F4A460",
    "#800080",
    "#00FA9A",
    "#DAA520",
    "#FFD700",
    "#98FB98",
    "#FAFAD2",
    "#AFEEEE",
    "#F0E68C",
    "#FF7F50",
    "#79cece",
    "#00CED1",
    "#808080",
    "#90EE90",
]


export function generateCorrespondanceLanguage() {
    return new Promise((resolve, reject) => {
        let i = 0;
        for (let code of getLanguages()) {
            correspondance[code.id] = {
                alias: code.aliases[0],
                color: color[i],
            }
            i++;
        }
        resolve();
    });
}

export function languageToColor(language: string){
    return correspondance[language].color || '#E7E7E7';
}

export function languageToAlias(language: string){
    return correspondance[language].alias || 'Plain text';
}

export function getLanguages() {
    return monaco.languages.getLanguages();
}