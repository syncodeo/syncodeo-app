import Code from "./Code";
import * as monaco from 'monaco-editor';
import { Playlist } from "./Playlists";
import { LeftMenu } from "../actions/leftMenu";

export interface IStateStore{
    codes: Code[];
    activeCodeIndex: number;
    activeEditCodeIndex: number;
    loading: number;
    itsMyVideo: boolean;
    menuCollapsed: boolean;
    isLogged: boolean;
    previousLanguage: string;
    actualLayout: 'layout-1' | 'layout-2';
    actualMonacoModel: monaco.editor.ITextModel;
    dragging: boolean;
    actualPlaylist: Playlist;
    userUuid: string;
    userConnectedUuid: string;
    gridList: boolean;
    leftMenu: LeftMenu;
    show404: boolean;
    isMobile: boolean;
}