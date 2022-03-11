import './GridList.less';

import React, { Children } from 'react';
import { List, Menu, Dropdown, Icon, Popconfirm, Tooltip } from 'antd';
import { Playlist } from '../../../interfaces/Playlists';
import Video from '../../../interfaces/Video';
import { Link } from 'react-router-dom';
import translate from '../../../localization';
import ImageList from '../ImageList/ImageList';
import difficultyLocalization from '../../../localization/en/en-us/difficulty';
import languageLocalization from '../../../localization/en/en-us/language';

interface IProps {
    type: 'playlist' | 'video';
    dataSource: Playlist[] | Video[];

    editMode?: boolean;
    playlists?: Playlist[];
    item?: Playlist | Video;
    notShowInformations?: boolean;
    onAddYoutubeVideo?: (video: Video) => void;
    onAddPlaylist?: (videoId: string) => void;
    onSettings?: (item: Video | Playlist) => void;
    onDelete?: (item: Video | Playlist) => void;
    onMoveToPlaylist?: (videoId: string, playlistUuid: string) => void;
}

const { Provider, Consumer } = React.createContext<IProps>(null);

class ContextMenu extends React.Component {

    render() {
        return (
            <Consumer>
                {props => {
                    const { onDelete, onSettings, onMoveToPlaylist, onAddPlaylist, item, type, playlists } = props;
                    return (
                        <Menu key={props.type === 'video' ? (item as Video).videoId : (item as Playlist).uuid} style={{ width: '180px' }}>
                            {type === 'video' && (
                                <Menu.SubMenu title="Move to playlist" onTitleClick={e => e.domEvent.stopPropagation()}>
                                    <Menu.Item onClick={(e) => {
                                        e.domEvent.stopPropagation();
                                        onAddPlaylist((item as Video).videoId);
                                    }}>
                                        <Icon type="plus" /> Add playlist
                                    </Menu.Item>
                                    {playlists.map(playlist => (
                                        <Menu.Item key={playlist.uuid} onClick={(e) => {
                                            e.domEvent.stopPropagation();
                                            onMoveToPlaylist((item as Video).videoId, playlist.uuid);
                                        }}>{playlist.title}
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            )}
                            <Menu.Item onClick={(e) => {
                                e.domEvent.stopPropagation();
                                onSettings(item);
                            }}>
                                <span><Icon type="setting" /> {translate('settings')}</span>
                            </Menu.Item>
                            <Menu.Item onClick={e => e.domEvent.stopPropagation()}>
                                <Popconfirm placement="left" okText={translate('ok')} cancelText={translate('cancel')} title={translate('delete') + '?'} onConfirm={() => onDelete(item)}>
                                    <span style={{ color: 'red' }} ><Icon type="delete" /> {translate('delete')}</span>
                                </Popconfirm>
                            </Menu.Item>
                        </Menu>
                    )
                }}
            </Consumer>
        )
    }
}

class ActionsDropdown extends React.Component {
    render() {
        return (
            <Consumer>
                {props => {
                    return (
                        <Dropdown key={props.type === 'video' ? (props.item as Video).videoId : (props.item as Playlist).uuid} overlay={<ContextMenu />} trigger={['click']} overlayStyle={{ float: 'right' }}>
                            <Icon onClick={e => e.stopPropagation()} className="icon-action" type="ellipsis" />
                        </Dropdown>
                    )
                }}
            </Consumer>
        )
    }
}

interface IStateItem {
    showEditIcon?: boolean;
}

class Item extends React.Component<any, IStateItem>{
    constructor(props) {
        super(props);

        this.state = {
            showEditIcon: false,
        }
    }

    render() {
        return (
            <Consumer>
                {props => {
                    const { editMode, type, item, onAddYoutubeVideo, notShowInformations } = props;
                    const { showEditIcon } = this.state;
                    let video = item as Video;
                    let playlist = item as Playlist;

                    const list = (
                        <List.Item id={type === 'video' ? 'videos' : 'playlists'} className={onAddYoutubeVideo && video.registered && 'cant-click'} style={{ cursor: 'pointer' }} onClick={() => onAddYoutubeVideo && onAddYoutubeVideo(item)}>
                            {editMode && showEditIcon && <ActionsDropdown />}
                            <ImageList type={type} item={item} notShowInformations={notShowInformations} gridList />
                            <div>
                                {!notShowInformations && (
                                    <div className="flagAndDifficulty">
                                        <Tooltip title={"Language: " + translate(item.language as (keyof typeof languageLocalization))}>
                                            <img className="flag" src={require('../../../img/selectImages/' + item.language + '.svg')} />
                                        </Tooltip>
                                        <Tooltip title={"Difficulty: " + translate(item.difficulty as (keyof typeof difficultyLocalization))}>
                                            <img className="difficulty" src={require('../../../img/selectImages/' + item.difficulty + '.svg')} />
                                        </Tooltip>
                                    </div>
                                )}
                                <h3 style={{ height: 50, overflow: 'hidden', width: 'calc(100% - 25px)' }}>{type === 'video' ? video.title : playlist.title}</h3>
                            </div>
                        </List.Item>
                    )

                    return (
                        onAddYoutubeVideo ? (
                            <div children={list}></div>
                        ) : (
                                <Link
                                    key={
                                        props.type === 'video' ? (item as Video).videoId : (item as Playlist).uuid
                                    } to={
                                        type === 'video' ? "/watch?v=" + video.videoId : "/playlists/" + playlist.uuid
                                    } onMouseEnter={() => {
                                        this.setState({ showEditIcon: true, })
                                    }} onMouseLeave={() => this.setState({ showEditIcon: false, })} children={list}
                                />
                            )
                    )
                }}
            </Consumer >
        )
    }
}

export default class GridList extends React.Component<IProps, any>{
    render() {
        return (
            <List
                id="grid-list"
                grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 6 }}
                dataSource={this.props.dataSource}
                rowKey={this.props.type === 'video' ? 'videoId' : 'uuid'}
                loading={!this.props.dataSource}
                renderItem={(item) => (
                    <Provider value={{ ...this.props, item, }}>
                        <Item />
                    </Provider>
                )}
            />
        )
    }
}