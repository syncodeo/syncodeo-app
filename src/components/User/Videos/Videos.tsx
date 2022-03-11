// React
import React from 'react';
import { Link } from 'react-router-dom';

// Components
import { Table, Tag, Popconfirm, message, Input, Button, Icon, Menu, Dropdown, List, Skeleton, Tooltip, } from 'antd';

// Controllers
import { getVideosFromUserConnected, deleteVideo, editVideo, getVideosCollaboratives, getVideosFromUser, } from '../../../controllers/videos';

// Interfaces
import { ColumnProps } from 'antd/lib/table';
import Video from '../../../interfaces/Video';
import FormEditAddVideo from '../../../components/Dashboard/FormEditAddVideo/FormEditAddVideo';
import { getColumnSearchProps } from '../../../helpers/table';
import translate from '../../../localization';
import { ClickParam } from 'antd/lib/menu';
import FormEditAddPlaylists from '../../components/../Playlists/FormEditAddPlaylists';
import { Playlist } from '../../../interfaces/Playlists';
import { getPlaylistsFromUserConnected, addVideoToPlaylist, getPlaylistFromUser } from '../../../controllers/playlists';
import { History, } from 'history';
import ModalAddCollaborators from '../../../components/VideosDisplay/ModalAddCollaborators';
import GridList from '../../../components/Lists/GridList/GridList';
import ImageList from '../../Lists/ImageList/ImageList';
import { NO_DATA_IMAGE } from '../../../constants';
import { connect } from 'react-redux';
import { IStateStore } from '../../../interfaces/Store';
import difficultyLocalization from '../../../localization/en/en-us/difficulty';
import languageLocalization from '../../../localization/en/en-us/language';

interface IProps extends IStateToProps {
    userUuid: string;
    canEdit: boolean;
    gridList?: boolean;
    collaboratives?: boolean;
    history: History;
    needToBeReloaded?: boolean;
    setLoadPlaylist?: (loadPLaylist: boolean) => void;
    setLoadPlaylistsInVideos?: (loadPlaylistsInVideos) => void;
}

interface IState {
    // Video
    videos: Array<Video>;
    confirmLoadingVideos: boolean;
    actualVideo?: Video;
    actualVideoId?: string;
    showModalEditVideo: boolean;

    // Playlist
    confirmLoadingPlaylist: boolean;
    showModelAddPlaylist: boolean;

    // Search
    searchText: string;

    // Actions
    showModalAddCollaborators: boolean;
    selectedRowKeys: string[] | number[];
    selectedRows: Video[];
    loadingAction: number;

    // Menu actions
    playlists: Playlist[];
}

class Videos extends React.Component<IProps, IState>{

    searchInput: React.RefObject<Input> = React.createRef();
    form: any;

    constructor(props: any) {
        super(props);

        this.state = {
            // Video
            videos: undefined,
            actualVideoId: '',
            confirmLoadingVideos: false,
            showModalEditVideo: false,

            // Playlist
            confirmLoadingPlaylist: false,
            showModelAddPlaylist: false,

            // Search
            searchText: '',

            // Actions
            showModalAddCollaborators: false,
            loadingAction: 0,
            selectedRows: [],
            selectedRowKeys: [],

            // Menu actions
            playlists: [],
        }
    }

    async componentDidMount() {
        this.init(this.props);
    }

    init = async (props: IProps) => {
        let videos = [];

        if (props.collaboratives) {
            const response = await getVideosCollaboratives();
            videos = response.data;
        } else if (props.canEdit) {
            const { data: playlists } = await getPlaylistsFromUserConnected();
            this.setState({ playlists });
            const response = await getVideosFromUserConnected();
            videos = response.data;
        } else {
            const { data: playlists } = await getPlaylistFromUser(props.userUuid);
            this.setState({ playlists });
            const response = await getVideosFromUser(props.userUuid);
            videos = response.data;
        }

        await this.setState({ videos });
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (this.props.canEdit !== nextProps.canEdit || nextProps.needToBeReloaded) {
            this.init(nextProps);
            this.props.setLoadPlaylistsInVideos(false);
        }
    }

    deleteVideo = (videoId: string) => {
        deleteVideo(videoId).then(response => {
            const data = [...this.state.videos];
            this.setState({ videos: data.filter(item => item.videoId !== videoId) });
        });
    }

    moveVideoToPlaylist = async (videoId: string, playlistUuid: string) => {
        try {
            await addVideoToPlaylist(playlistUuid, videoId);
            this.props.history.push('/playlists/' + playlistUuid);
        } catch{ }
    }

    onUpdated = (video: Video) => {
        let index = this.state.videos.findIndex(item => item.videoId === video.videoId);
        let videos = this.state.videos;
        videos[index] = video;
        this.setState({ actualVideo: undefined, videos, showModalEditVideo: false, });
    }

    handleSearch = (selectedKeys: any[], confirm: any) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters: any) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    handleChangeVisibility = async (e: ClickParam) => {
        const { selectedRows } = this.state;
        this.setState({ loadingAction: selectedRows.length, });
        const visibility = e.key;

        new Promise(async () => {
            for (let video of selectedRows) {
                try {
                    const { data: editedVideo } = await editVideo(video.videoId, { visibility: visibility as 'private' | 'public' | 'unlisted' });
                    let index = this.state.videos.indexOf(video);
                    let data = [...this.state.videos];
                    data[index] = { ...editedVideo, key: video.videoId, };
                    await this.setState({ videos: data });
                } catch{ }

                await this.setState({ loadingAction: this.state.loadingAction - 1 });
                if (this.state.loadingAction === 0) {
                    this.setState({ selectedRows: [], selectedRowKeys: [], });
                }
            }
        });
    }

    handleDeleteVideos = async (e: React.MouseEvent<any, MouseEvent>) => {
        const { selectedRows } = this.state;
        this.setState({ loadingAction: selectedRows.length });

        new Promise(async () => {
            for (let video of selectedRows) {
                try {
                    await deleteVideo(video.videoId);
                    const data = [...this.state.videos];
                    this.setState({ videos: data.filter(item => item.videoId !== video.videoId) });
                } catch{ }

                await this.setState({ loadingAction: this.state.loadingAction - 1 });
                if (this.state.loadingAction === 0) {
                    this.setState({ selectedRowKeys: [], selectedRows: [], });
                }
            }
        });
    }

    handleMoveToPlaylist = async (playlist: Playlist) => {
        const { selectedRows } = this.state;
        await this.setState({ loadingAction: selectedRows.length });

        new Promise(async () => {
            for (let video of selectedRows) {
                try {
                    await addVideoToPlaylist(playlist.uuid, video.videoId, { notShowErrors: ['E-409-03'] });
                } catch{ }

                await this.setState({ loadingAction: this.state.loadingAction - 1, });
                if (this.state.loadingAction === 0) {
                    this.props.history.push('/playlists/' + playlist.uuid);
                }
            }
        });
    }

    render() {
        const menu = (
            <Menu>
                <Menu.SubMenu key="move-to-playlist" title="Move to playlist">
                    <Menu.Item onClick={() => this.setState({ showModelAddPlaylist: true, })}><Icon type="plus" /> Add playlist</Menu.Item>
                    {this.state.playlists.map(playlist => (
                        <Menu.Item key={playlist.uuid} onClick={() => this.handleMoveToPlaylist(playlist)}>{playlist.title}</Menu.Item>
                    ))}
                </Menu.SubMenu>
                <Menu.SubMenu key="change-visibility" title="Change visibility">
                    <Menu.Item key="public" onClick={this.handleChangeVisibility}>Public</Menu.Item>
                    <Menu.Item key="private" onClick={this.handleChangeVisibility}>Private</Menu.Item>
                    <Menu.Item key="unlisted" onClick={this.handleChangeVisibility}>Unlisted</Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key="add-collaborators" onClick={() => this.setState({ showModalAddCollaborators: true, })}>Add collaborators</Menu.Item>
                <Menu.Item key="delete" style={{ color: 'red', }}>
                    <Popconfirm okText={translate('ok')} cancelText={translate('cancel')} title={translate('delete') + '?'} onConfirm={this.handleDeleteVideos}>
                        Delete all selected videos
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        )

        let columns: ColumnProps<any>[] = [{
            title: (
                !this.props.collaboratives && (
                    <Dropdown overlay={menu} trigger={['click']} disabled={this.state.selectedRows.length === 0}>
                        <Button loading={this.state.loadingAction !== 0}>Actions <Icon type="down" /></Button>
                    </Dropdown>
                )
            ),
            key: 'Image',
            width: 250,
            render: (video: Video) => (
                <Link to={"/watch?v=" + video.videoId}>
                    <ImageList item={video} type="video" gridList={false} />
                </Link>
            )
        }, {
            key: 'title',
            render: (video: Video) => (
                <div className="text">
                    <Link to={"/watch?v=" + video.videoId}>
                        <h3>{video.title}</h3>
                    </Link>
                    <p>{video.description}</p>
                    <ul className="tags">
                        <ul className="flagAndDifficulty">
                            <Tooltip title={"Language: " + translate(video.language as (keyof typeof languageLocalization))}>
                                <li><img width="24" src={require('../../../img/selectImages/' + video.language + '.svg')} /></li>
                            </Tooltip>
                            <Tooltip title={"Difficulty: " + translate(video.difficulty as (keyof typeof difficultyLocalization))}>
                                <li><img width="24" src={require('../../../img/selectImages/' + video.difficulty + '.svg')} /></li>
                            </Tooltip>
                            {video.tags.length > 0 && <li>|</li>}
                        </ul>
                        {video.tags.map((tag: any) => <li key={tag}><Tag color="blue">{tag}</Tag></li>)}
                    </ul>
                </div>
            ),
            ...getColumnSearchProps('title', this.searchInput, this.handleSearch, this.handleReset),
        }, {
            title: translate('visibility'),
            dataIndex: 'visibility',
            key: 'visibility',
            filterMultiple: false,
            width: 40,
            render: (visibility: 'public' | 'private' | 'unlisted') => translate(visibility),
            filters: [{
                text: translate('private'),
                value: 'private',
            }, {
                text: translate('public'),
                value: 'public',
            }, {
                text: translate('unlisted'),
                value: 'unlisted',
            }],
            onFilter: (value: string, record: Video) => record.visibility.indexOf(value) === 0,
        }];

        if (!this.props.collaboratives) {
            columns = [...columns, , {
                key: 'action',
                width: 5,
                render: (video: Video) => (
                    <ul className="buttons">
                        <li>
                            <a onClick={() => this.setState({ actualVideo: video, showModalEditVideo: true, })}>
                                <Button icon="setting">{translate('settings')}</Button>
                            </a>
                        </li>
                        <li>
                            <Popconfirm okText={translate('ok')} cancelText={translate('cancel')} title={translate('delete') + '?'} onConfirm={(e) => this.deleteVideo(video.videoId)}>
                                <Button icon="delete" type="danger">{translate('delete')}</Button>
                            </Popconfirm>
                        </li>
                    </ul>
                ),
            }]
        }

        return (
            <>
                <ModalAddCollaborators
                    onCancel={() => this.setState({ showModalAddCollaborators: false, })}
                    visible={this.state.showModalAddCollaborators}
                    selectedRows={this.state.selectedRows}
                    onUpdated={this.onUpdated}
                    clearSelectedRows={() => this.setState({ selectedRowKeys: [], selectedRows: [], })}
                />
                <FormEditAddPlaylists
                    title={translate('addPlaylist')}
                    okText={translate('addSmth', { smth: '' })}
                    visible={this.state.showModelAddPlaylist}
                    onCancel={() => this.setState({ showModelAddPlaylist: false, actualVideoId: '' })}
                    history={this.props.history}
                    videoId={this.state.actualVideoId}
                    videos={this.state.selectedRows}
                    onAddedPlaylist={playlist => {
                        this.props.setLoadPlaylist(true);
                        this.setState({ playlists: [...this.state.playlists, playlist] });
                    }}
                />
                <FormEditAddVideo
                    type="edit"
                    video={this.state.actualVideo}
                    modalProps={{
                        title: translate('editAVideo'),
                        centered: true,
                        width: '90%',
                        visible: this.state.showModalEditVideo,
                        onCancel: async () => {
                            await this.setState({ showModalEditVideo: false, });
                            await this.setState({ actualVideo: undefined });
                        },
                    }}
                    onUpdated={video => {
                        this.onUpdated(video);
                        message.success(translate('videoSuccessfullyModified'));
                    }}
                />
                {this.props.gridList ? (
                    <GridList
                        type="video"
                        dataSource={this.state.videos}
                        playlists={this.state.playlists}
                        editMode={this.props.canEdit}
                        onDelete={(item) => {
                            this.deleteVideo((item as Video).videoId);
                        }}
                        onSettings={(item) => {
                            this.setState({ actualVideo: item, showModalEditVideo: true, });
                        }}
                        onMoveToPlaylist={(videoId, playlistUuid) => {
                            this.moveVideoToPlaylist(videoId, playlistUuid);
                        }}
                        onAddPlaylist={videoId => {
                            this.setState({ actualVideoId: videoId, showModelAddPlaylist: true });
                        }}
                    />
                ) : (
                        this.props.canEdit || this.props.collaboratives ? (
                            <div id="video-display">
                                <Table
                                    className="table"
                                    size="middle"
                                    locale={{
                                        emptyText: (
                                            <span>
                                                {NO_DATA_IMAGE}<br />
                                                {translate('noVideo')}<br />
                                                {!this.props.collaboratives && <Link to={"/user/" + this.props.userConnectedUuid + '/add'}>{translate('clickToAddOne')}</Link>}
                                            </span>
                                        ) as any
                                    }}
                                    scroll={{ y: "calc(100vh - 250px)" }}
                                    bodyStyle={{ backgroundColor: 'white', }}
                                    loading={!this.state.videos}
                                    columns={columns}
                                    dataSource={this.state.videos}
                                    rowKey="videoId"
                                    pagination={false}
                                    onRow={(record: Video, rowIndex) => {
                                        return {
                                            id: record.videoId,
                                        };
                                    }}
                                    rowSelection={this.props.collaboratives ? null : {
                                        selectedRowKeys: this.state.selectedRowKeys,
                                        onChange: (selectedRowKeys, selectedRows) => this.setState({ selectedRowKeys, selectedRows, })
                                    }}
                                />
                            </div>
                        ) : (
                                <List
                                    locale={{
                                        emptyText: (
                                            <span>
                                                {NO_DATA_IMAGE} <br />
                                                {translate('noData')}
                                            </span>
                                        ) as any
                                    }}
                                    className="list-videos"
                                    itemLayout="vertical"
                                    size="large"
                                    dataSource={this.state.videos}
                                    loading={!this.state.videos}
                                    footer={null}
                                    split
                                    renderItem={(video: Video) => (
                                        <List.Item className="item">
                                            <Link to={'/watch?v=' + video.videoId}>
                                                <div className="image">
                                                    <ImageList type="video" item={video} gridList={false} />
                                                </div>
                                                <div className="texte">
                                                    <h2 className="title">{video.title}</h2>
                                                    <div className="description">{video.description.split('\n').map((item, i) => <p key={i}>{item}</p>)}</div>
                                                    <ul className="tags">
                                                        <ul className="flagAndDifficulty">
                                                            <Tooltip title={"Language: " + translate(video.language as (keyof typeof languageLocalization))}>
                                                                <li><img width="24" src={require('../../../img/selectImages/' + video.language + '.svg')} /></li>
                                                            </Tooltip>
                                                            <Tooltip title={"Difficulty: " + translate(video.difficulty as (keyof typeof difficultyLocalization))}>
                                                                <li><img width="24" src={require('../../../img/selectImages/' + video.difficulty + '.svg')} /></li>
                                                            </Tooltip>
                                                            {video.tags.length > 0 && <li>|</li>}
                                                        </ul>
                                                        {video.tags.map((tag: any) => <li key={tag}><Tag color="blue">{tag}</Tag></li>)}
                                                    </ul>
                                                </div>
                                            </Link>
                                        </List.Item>
                                    )} />
                            )
                    )}
            </>
        )
    }
}

interface IStateToProps {
    userConnectedUuid: IStateStore['userConnectedUuid'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        userConnectedUuid: state.userConnectedUuid,
    }
};

export default connect(mapStateToProps, null)(Videos);