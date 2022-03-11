import './EditPlaylists.less';

// React
import React from 'react';
import translate from '../../localization';
import { Table, Tag, Menu, Dropdown, Button, Icon, Popconfirm, Input, message, Row, Col, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Link, match, RouteComponentProps } from 'react-router-dom';
import Video from '../../interfaces/Video';
import { DragDropContext, DropTarget, DragSource } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { getVideosFromPlaylist, deleteVideoOnPlaylist, editRankVideoInPlaylist } from '../../controllers/playlists';
import { Playlist } from '../../interfaces/Playlists';
import { getColumnSearchProps } from '../../helpers/table';
import FormEditAddVideo from '../../components/Dashboard/FormEditAddVideo/FormEditAddVideo';
import FormEditAddPlaylists from '../../components/Playlists/FormEditAddPlaylists';
import { User } from '../../interfaces/User';
import { getUserInfo } from '../../controllers/user';
import { IStateStore } from '../../interfaces/Store';
import { connect } from 'react-redux';
import ImageList from '../../components/Lists/ImageList/ImageList';
import { NO_DATA_IMAGE } from '../../constants';
import UserNameAvatar from '../../components/User/UserNameAvatar/UserNameAvatar';
import { bindActionCreators } from 'redux';
import { ILeftMenuAction, updateLeftMenu } from '../../actions/leftMenu';
import difficultyLocalization from '../../localization/en/en-us/difficulty';
import languageLocalization from '../../localization/en/en-us/language';
import { IShow404Action, setShow404 } from '../../actions/show404';
import { ILoadingAction, incrementLoading, decrementLoading } from '../../actions/loading';
import { hideLoading } from 'react-redux-loading-bar';

interface IProps extends IStateToProps, IDispatchToProps {
    route: RouteComponentProps;
}

interface IState {
    itsMyPlaylist: boolean;
    user: User;
    playlist: Playlist;
    actualVideo: Video;
    showEditModalVideo: boolean;
    showEditSettingModal: boolean;
    loadingAction: number;
    draggedVideoId: string;
    selectedRowKeys: string[] | number[];
    selectedRows: Video[];
    searchText: string;
    getUserInfoLoading: boolean;
}

let dragingIndex = -1;

class BodyRow extends React.Component<any, any> {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            itsMyPlaylist,
            playlistUuid,
            resetSelectedRow,
            onClick,
            draggedVideoId,
            setVideoId,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: itsMyPlaylist ? 'move' : 'pointer' };

        let className = restProps.className;
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += ' drop-over-downward';
            }
            if (restProps.index < dragingIndex) {
                className += ' drop-over-upward';
            }
        }

        return this.props.itsMyPlaylist ? (connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        )) : <tr
                {...restProps}
                className={className}
                style={style}
                onClick={onClick}
            />;
    }
}

const rowSource = {
    beginDrag(props) {
        dragingIndex = props.index;
        props.setVideoId(props['data-row-key']);
        props.resetSelectedRow();
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        if (dragIndex === hoverIndex) {
            return;
        }
        editRankVideoInPlaylist(props.playlistUuid, props.draggedVideoId, hoverIndex + 1);
        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};
const DragableBodyRow = DropTarget(
    'row',
    rowTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }),
)(
    DragSource(
        'row',
        rowSource,
        (connect) => ({
            connectDragSource: connect.dragSource(),
        }),
    )(BodyRow),
);

class EditPlaylists extends React.Component<IProps, IState>{

    searchInput: React.RefObject<Input> = React.createRef();

    constructor(props: IProps) {
        super(props);

        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            draggedVideoId: '',
            loadingAction: 0,
            searchText: '',
            user: undefined,
            playlist: undefined,
            actualVideo: undefined,
            showEditModalVideo: false,
            showEditSettingModal: false,
            itsMyPlaylist: false,
            getUserInfoLoading: true,
        }
    }

    async componentWillMount() {
        await this.init();
    }

    async init() {
        try {
            const { data: playlist } = await getVideosFromPlaylist(this.props.route.match.params['id']);
            const { data: user } = await getUserInfo(playlist.owner);
            await this.setState({ playlist, user, getUserInfoLoading: false, itsMyPlaylist: this.props.isLogged && playlist.owner === this.props.userConnectedUuid });
            await this.props.updateLeftMenu({
                title: this.state.itsMyPlaylist ? 'Edit playlist (' + playlist.title + ')' : playlist.title,
                backIcon: true,
            });
        } catch (error) {
            if (error.response && (error.response.status === 404 || error.response.status === 400)) {
                this.props.setShow404();
            }
        }
        this.props.hideLoading();
    }

    async componentWillReceiveProps(nextProps: IProps) {
        if (this.props.isLogged !== nextProps.isLogged) {
            await this.init();
        }
    }

    handleSearch = (selectedKeys: any[], confirm: any) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters: any) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    moveRow = (dragIndex, hoverIndex) => {
        const { playlist } = this.state;
        const videos = playlist.videos;
        const dragRow = videos[dragIndex];

        this.setState({
            playlist: update(this.state.playlist, {
                videos: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
                }
            })
        })
    }

    onUpdated = (video: Video) => {
        let index = this.state.playlist.videos.findIndex(item => item.videoId === video.videoId);
        let videos = this.state.playlist.videos;
        videos[index] = video;
        this.setState({
            actualVideo: undefined, playlist: {
                ...this.state.playlist,
                videos,
            }, showEditModalVideo: false,
        });
    }

    handleDeletVideo = async (video: Video) => {
        try {
            await deleteVideoOnPlaylist(this.state.playlist.uuid, video.videoId);
            let videos = this.state.playlist.videos;
            await this.setState({ playlist: { ...this.state.playlist, videos: videos.filter(item => item.videoId !== video.videoId) } });
        } catch{ }
    }

    handleDeleteVideosAction = () => {
        this.setState({ loadingAction: this.state.selectedRows.length });

        new Promise(async () => {
            for (let video of this.state.selectedRows) {
                try {
                    await deleteVideoOnPlaylist(this.state.playlist.uuid, video.videoId);
                    let videos = this.state.playlist.videos;
                    await this.setState({ playlist: { ...this.state.playlist, videos: videos.filter(item => item.videoId !== video.videoId) } });
                } catch { }
                this.setState({ loadingAction: this.state.loadingAction - 1 });
            }
        });
    }


    deleteVideo = (videoId: string) => {
        deleteVideoOnPlaylist(this.state.playlist.uuid, videoId).then(response => {
            let videos = this.state.playlist.videos;
            this.setState({ playlist: { ...this.state.playlist, videos: videos.filter(item => item.videoId !== videoId) } })
        });
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="delete" style={{ color: 'red', }}>
                    <Popconfirm okText={translate('ok')} cancelText={translate('cancel')} title={translate('delete') + '?'} onConfirm={this.handleDeleteVideosAction}>
                        Delete all selected videos
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        )

        let columns: ColumnProps<any>[] = [{
            title: (
                this.state.itsMyPlaylist ? (
                    <Dropdown overlay={menu} trigger={['click']} disabled={this.state.selectedRows.length === 0}>
                        <Button loading={this.state.loadingAction !== 0}>Actions <Icon type="down" /></Button>
                    </Dropdown>
                ) : <div style={{ height: 32, }}></div>
            ),
            key: 'Image',
            width: 250,
            render: (video: Video) => (
                this.state.itsMyPlaylist ? (
                    <Link to={"/watch?v=" + video.videoId + '&p=' + playlist.uuid}>
                        <ImageList item={video} type="video" gridList={false} />
                    </Link>
                ) : (
                        <Link to={"/watch?v=" + video.videoId + '&p=' + playlist.uuid}>
                            <div style={{ marginLeft: 15 }}>
                                <ImageList item={video} type="video" gridList={false} />
                            </div>
                        </Link>
                    )
            )
        }, {
            key: 'title',
            render: (video: Video) => (
                <div className="text">
                    <Link to={"/watch?v=" + video.videoId + '&p=' + playlist.uuid}>
                        <h3>{video.title}</h3>
                    </Link>
                    <p>{video.description}</p>
                    <ul className="tags">
                        <ul className="flagAndDifficulty">
                            <Tooltip title={"Language: " + translate(video.language as (keyof typeof languageLocalization))}>
                                <li><img width="24" src={require('../../img/selectImages/' + video.language + '.svg')} /></li>
                            </Tooltip>
                            <Tooltip title={"Difficulty: " + translate(video.difficulty as (keyof typeof difficultyLocalization))}>
                                <li><img width="24" src={require('../../img/selectImages/' + video.difficulty + '.svg')} /></li>
                            </Tooltip>
                            {video.tags.length > 0 && <li>|</li>}
                        </ul>
                        {video.tags.map((tag: any) => <li key={tag}><Tag color="blue">{tag}</Tag></li>)}
                    </ul>
                </div>
            ),
            ...getColumnSearchProps('title', this.searchInput, this.handleSearch, this.handleReset),
        }];
        if (this.state.itsMyPlaylist) {
            columns = [...columns, {
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
            }, {
                key: 'action',
                width: 5,
                render: (video: Video) => (
                    <ul className="buttons">
                        <li>
                            <Button icon="setting" onClick={() => this.setState({ actualVideo: video, showEditModalVideo: true, })}>{translate('settings')}</Button>
                        </li>
                        <li>
                            <Popconfirm okText={translate('ok')} cancelText={translate('cancel')} title={translate('delete') + '?'} onConfirm={(e) => this.handleDeletVideo(video)}>
                                <Button icon="delete" type="danger">{translate('delete')}</Button>
                            </Popconfirm>
                        </li>
                    </ul>
                ),
            }];
        }
        const { playlist } = this.state;

        return (
            <>
                {this.state.itsMyPlaylist && (
                    <FormEditAddPlaylists
                        title={translate('edit')}
                        onCancel={() => this.setState({ showEditSettingModal: false, })}
                        visible={this.state.showEditSettingModal}
                        okText={translate('edit')}
                        playlist={this.state.playlist}
                        onEditPlaylist={playlist => this.setState({ playlist, })}
                    />
                )}
                <Row id="edit-playlists">
                    <Col span={8} id="info">
                        {playlist && (
                            <>
                                <ImageList type="playlist" item={playlist} notShowInformations />
                                <h1 style={{ marginBottom: 5, }}>{playlist.title}</h1>
                                {(
                                    <ul className="tags">
                                        <ul className="flagAndDifficulty">
                                            <Tooltip title={"Language: " + translate(playlist.language as (keyof typeof languageLocalization))}>
                                                <li><img width="24" src={require('../../img/selectImages/' + playlist.language + '.svg')} /></li>
                                            </Tooltip>
                                            <Tooltip title={"Difficulty: " + translate(playlist.difficulty as (keyof typeof difficultyLocalization))}>
                                                <li><img width="24" src={require('../../img/selectImages/' + playlist.difficulty + '.svg')} /></li>
                                            </Tooltip>
                                            {playlist.tags.length > 0 && <li>|</li>}
                                        </ul>
                                        {playlist.tags.map((tag: any) => <li key={tag}><Tag color="blue">{tag}</Tag></li>)}
                                    </ul>
                                )}
                                <p>{playlist.videos.length} videos</p>
                                <Tag><Icon type="eye" /> {playlist.visibility}</Tag>
                                {this.state.user && (
                                    <div style={{ marginTop: 15 }}>
                                        <UserNameAvatar user={this.state.user} getUserInfoLoading={this.state.getUserInfoLoading} userSpan />
                                        {this.state.itsMyPlaylist && (
                                            <Button style={{ float: 'right' }} icon="edit" onClick={() => this.setState({ showEditSettingModal: true, })}>Edit</Button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </Col>
                    <Col span={16}>
                        <FormEditAddVideo
                            type="edit"
                            video={this.state.actualVideo}
                            modalProps={{
                                title: translate("editAVideo"),
                                visible: this.state.showEditModalVideo,
                                width: '90%',
                                centered: true,
                                okButtonProps: { htmlType: 'submit' },
                                onCancel: () => this.setState({ showEditModalVideo: false, }),
                            }}
                            onUpdated={video => {
                                this.onUpdated(video);
                                message.success(translate('videoSuccessfullyModified'));
                            }}
                        />
                        <Table
                            className="table"
                            size="middle"
                            bodyStyle={{ backgroundColor: 'white', }}
                            pagination={false}
                            columns={columns}
                            loading={!this.state.playlist}
                            dataSource={this.state.playlist && this.state.playlist.videos}
                            locale={{
                                emptyText:(
                                    <span>
                                        {NO_DATA_IMAGE} <br />
                                        {translate('noVideo')}<br />{this.state.itsMyPlaylist && <Link to={"/user/" + this.props.userConnectedUuid}>{translate('clickToAddOne')}</Link>}
                                    </span>
                                ) as any
                            }}
                            rowKey="videoId"
                            scroll={{ y: "calc(100vh - 155px)" }}
                            components={{
                                body: {
                                    row: DragableBodyRow,
                                }
                            }}
                            onRow={(record, index) => ({
                                onClick: () => {
                                    if (playlist) {
                                        this.props.route.history.push('/watch?v=' + record.videoId + '&p=' + playlist.uuid);
                                    }
                                },
                                index,
                                moveRow: this.moveRow,
                                playlistUuid: this.state.playlist.uuid,
                                draggedVideoId: this.state.draggedVideoId,
                                setVideoId: (videoId: string) => {
                                    this.setState({ draggedVideoId: videoId, })
                                },
                                resetSelectedRow: () => {
                                    this.setState({ selectedRowKeys: [], selectedRows: [], });
                                },
                                itsMyPlaylist: this.state.itsMyPlaylist,
                            })}
                            rowSelection={this.state.itsMyPlaylist ? {
                                selectedRowKeys: this.state.selectedRowKeys,
                                onChange: (selectedRowKeys, selectedRows) => this.setState({ selectedRowKeys, selectedRows, })
                            } : null}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}

interface IStateToProps {
    isLogged: IStateStore['isLogged'],
    userConnectedUuid: IStateStore['userConnectedUuid'],
}

const mapStateToProps = (state: IStateStore) => {
    return {
        isLogged: state.isLogged,
        userConnectedUuid: state.userConnectedUuid,
    }
};

interface IDispatchToProps {
    updateLeftMenu: ILeftMenuAction['updateLeftMenu'];
    setShow404: IShow404Action['setShow404'];
    hideLoading: typeof hideLoading;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateLeftMenu: bindActionCreators(updateLeftMenu, dispatch),
        setShow404: bindActionCreators(setShow404, dispatch),
        hideLoading: bindActionCreators(hideLoading, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(EditPlaylists));