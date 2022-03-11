// React
import React from 'react';
import translate from '../../../localization';
import { Icon, Popconfirm, Table, Dropdown, Button, Tag, Menu, Input, List, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import FormEditAddPlaylists from '../../../components/Playlists/FormEditAddPlaylists';
import { Playlist } from '../../../interfaces/Playlists';
import { getPlaylistsFromUserConnected, deletePlaylist, editPlaylist, getPlaylistFromUser } from '../../../controllers/playlists';
import { ColumnProps } from 'antd/lib/table';
import { getColumnSearchProps } from '../../../helpers/table';
import { ClickParam } from 'antd/lib/menu';
import GridList from '../../Lists/GridList/GridList';
import ImageList from '../../Lists/ImageList/ImageList';
import { NO_DATA_IMAGE } from '../../../constants';
import { IStateStore } from '../../../interfaces/Store';
import { connect } from 'react-redux';
import difficultyLocalization from '../../../localization/en/en-us/difficulty';
import languageLocalization from '../../../localization/en/en-us/language';

interface IProps extends IStateToProps {
    userUuid: string;
    canEdit: boolean;
    gridList?: boolean;
    needToBeReload: boolean;
    setLoadPlaylist: (loadPlaylist: boolean) => void;
    setLoadPlaylistsInVideos: (loadPlaylistInVideo: boolean) => void;
}

interface IState {
    playlists: Playlist[];
    actualPlaylist: Playlist;
    showSettingModal: boolean;

    // Search
    searchText: string;

    // Actions
    loadingAction: number;
    selectedRows: Playlist[];
    selectedRowKeys: string[] | number[];
}

class Playlists extends React.Component<IProps, IState>{

    searchInput: React.RefObject<Input> = React.createRef();

    constructor(props: IProps) {
        super(props);

        this.state = {
            playlists: undefined,
            actualPlaylist: undefined,
            showSettingModal: false,

            searchText: '',

            loadingAction: 0,
            selectedRows: [],
            selectedRowKeys: [],
        }
    }

    async componentDidMount() {
        this.init(this.props);
    }

    init = async (props: IProps) => {
        let playlists = [];
        if (props.canEdit) {
            try {
                const { data: response } = await getPlaylistsFromUserConnected();
                playlists = response;
            } catch{ }
        } else {
            try {
                const { data: response } = await getPlaylistFromUser(props.userUuid);
                playlists = response;
            } catch{ }
        }
        this.setState({ playlists });
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (this.props.canEdit !== nextProps.canEdit || nextProps.needToBeReload) {
            this.init(nextProps);
            this.props.setLoadPlaylist(false);
        }
    }

    openSettingModal = (e: React.MouseEvent<HTMLElement, MouseEvent>, actualPlaylist: Playlist) => {
        e.preventDefault();

        this.setState({
            showSettingModal: true,
            actualPlaylist,
        });
    }

    handleSearch = (selectedKeys: any[], confirm: any) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters: any) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    // Delete only one playlist
    handleDelete = (uuid: string) => {
        deletePlaylist(uuid).then(response => {
            const data = [...this.state.playlists];
            this.setState({ playlists: data.filter(item => item.uuid !== uuid) });
        });
    }

    // Change visibility of selected playlists
    handleChangeVisibilityAction = (e: ClickParam) => {
        this.setState({ loadingAction: this.state.selectedRows.length, });
        const visibility = e.key as 'private' | 'public' | 'unlisted';

        new Promise(async () => {
            for (let playlist of this.state.selectedRows) {
                try {
                    const { data: editedPlaylist } = await editPlaylist(playlist.uuid, { visibility });
                    let index = this.state.playlists.indexOf(playlist);
                    let playlists = [...this.state.playlists];
                    playlists[index] = editedPlaylist;
                    await this.setState({ playlists });
                } catch{ }

                await this.setState({ loadingAction: this.state.loadingAction - 1 });
                if (this.state.loadingAction === 0) {
                    this.setState({ selectedRows: [], selectedRowKeys: [], });
                }
            }
        });
    }
    // Delete selected playlists
    handleDeleteAction = () => {
        this.setState({ loadingAction: this.state.selectedRows.length });

        new Promise(async () => {
            for (let playlist of this.state.selectedRows) {
                try {
                    await deletePlaylist(playlist.uuid);
                    const data = [...this.state.playlists];
                    this.setState({ playlists: data.filter(item => item.uuid !== playlist.uuid) });
                } catch{ }

                await this.setState({ loadingAction: this.state.loadingAction - 1 });
                if (this.state.loadingAction === 0) {
                    this.setState({ selectedRowKeys: [], selectedRows: [] });
                }
            }
        });
    }

    render() {
        const menu = (
            <Menu>
                <Menu.SubMenu key="change-visibility" title="Change visibility">
                    <Menu.Item key="public" onClick={this.handleChangeVisibilityAction}>Public</Menu.Item>
                    <Menu.Item key="private" onClick={this.handleChangeVisibilityAction}>Private</Menu.Item>
                    <Menu.Item key="unlisted" onClick={this.handleChangeVisibilityAction}>Unlisted</Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key="delete" style={{ color: 'red', }}>
                    <Popconfirm okText={translate('ok')} cancelText={translate('cancel')} title={translate('delete') + '?'} onConfirm={this.handleDeleteAction}>
                        Delete all selected playlists
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        )

        const columns: ColumnProps<any>[] = [{
            title: (
                <Dropdown overlay={menu} trigger={['click']} disabled={this.state.selectedRows.length === 0}>
                    <Button loading={this.state.loadingAction !== 0}>Actions <Icon type="down" /></Button>
                </Dropdown>
            ),
            key: 'Image',
            width: 250,
            render: (playlist: Playlist) => (
                <Link to={"/playlists/" + playlist.uuid}>
                    <ImageList type='playlist' item={playlist} gridList={false} />
                </Link>
            )
        }, {
            key: 'title',
            render: (playlist: Playlist) => (
                <div className="text">
                    <Link to={"/playlists/" + playlist.uuid}>
                        <h3>{playlist.title}</h3>
                    </Link>
                    <p>{playlist.description}</p>
                    <ul className="tags">
                        <ul className="flagAndDifficulty">
                            <Tooltip title={"Language: " + translate(playlist.language as (keyof typeof languageLocalization))}>
                                <li><img width="24" src={require('../../../img/selectImages/' + playlist.language + '.svg')} /></li>
                            </Tooltip>

                            <Tooltip title={"Difficulty: " + translate(playlist.difficulty as (keyof typeof difficultyLocalization))}>
                                <li><img width="24" src={require('../../../img/selectImages/' + playlist.difficulty + '.svg')} /></li>
                            </Tooltip>
                            {playlist.tags.length > 0 && <li>|</li>}
                        </ul>
                        {playlist.tags.map((tag: any) => <li key={tag}><Tag color="blue">{tag}</Tag></li>)}
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
            onFilter: (value: string, record: Playlist) => record.visibility.indexOf(value) === 0,
        }, {
            key: 'action',
            width: 5,
            render: (playlist: Playlist) => (
                <ul className="buttons">
                    <li>
                        <a onClick={() => this.setState({ actualPlaylist: playlist, showSettingModal: true, })}>
                            <Button icon="setting">{translate('settings')}</Button>
                        </a>
                    </li>
                    <li>
                        <Popconfirm okText={translate('ok')} cancelText={translate('cancel')} title={translate('delete') + '?'} onConfirm={(e) => this.handleDelete(playlist.uuid)}>
                            <Button icon="delete" type="danger">{translate('delete')}</Button>
                        </Popconfirm>
                    </li>
                </ul>
            ),
        }];

        return (
            <>
                {this.props.gridList ? (
                    <GridList
                        type="playlist"
                        editMode={this.props.canEdit}
                        dataSource={this.state.playlists}
                        onDelete={playlist => this.handleDelete((playlist as Playlist).uuid)}
                        onSettings={playlist => this.setState({ actualPlaylist: playlist, showSettingModal: true, })}
                    />
                ) : (
                        this.props.canEdit ? (
                            <div id="playlists">
                                <Table
                                    className="table"
                                    size="middle"
                                    locale={{
                                        emptyText: (
                                            <span>{translate('noPlaylist')}<br />
                                                <Link to={"/user/" + this.props.userConnectedUuid}>Go to your videos!</Link><br />
                                                Select your videos and click on "Add playlist" action to add one.</span>
                                        ) as any
                                    }}
                                    scroll={{ y: "calc(100vh - 250px)" }}
                                    bodyStyle={{ backgroundColor: 'white', }}
                                    loading={!this.state.playlists}
                                    columns={columns}
                                    dataSource={this.state.playlists}
                                    rowKey="uuid"
                                    pagination={false}
                                    rowSelection={{
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
                                    dataSource={this.state.playlists}
                                    loading={!this.state.playlists}
                                    footer={null}
                                    split
                                    renderItem={(playlist: Playlist) => (
                                        <List.Item className="item">
                                            <Link to={"/playlists/" + playlist.uuid}>
                                                <div className="image">
                                                    <ImageList type="playlist" item={playlist} gridList={false} />
                                                </div>
                                                <div className="texte">
                                                    <h2 className="title">{playlist.title}</h2>
                                                    <div className="description">{playlist.description.split('\n').map((item, i) => <p key={i}>{item}</p>)}</div>
                                                    <ul className="tags">
                                                        <ul className="flagAndDifficulty">

                                                            <Tooltip title={"Language: " + translate(playlist.language as (keyof typeof languageLocalization))}>
                                                                <li><img width="24" src={require('../../../img/selectImages/' + playlist.language + '.svg')} /></li>
                                                            </Tooltip>
                                                            <Tooltip title={"Difficulty: " + translate(playlist.difficulty as (keyof typeof difficultyLocalization))}>
                                                                <li><img width="24" src={require('../../../img/selectImages/' + playlist.difficulty + '.svg')} /></li>
                                                            </Tooltip>
                                                            {playlist.tags.length > 0 && <li>|</li>}
                                                        </ul>
                                                        {playlist.tags.map((tag: any) => <li key={tag}><Tag color="blue">{tag}</Tag></li>)}
                                                    </ul>
                                                </div>
                                            </Link>
                                        </List.Item>
                                    )} />
                            )
                    )}
                {this.props.canEdit && (
                    <FormEditAddPlaylists
                        title={this.state.actualPlaylist ? translate('edit') + ' ' + this.state.actualPlaylist.title : translate('edit')}
                        onCancel={() => this.setState({ showSettingModal: false, })}
                        visible={this.state.showSettingModal}
                        okText={translate('edit')}
                        playlist={this.state.actualPlaylist}
                        onEditPlaylist={async (playlist) => {
                            let indexActualPlaylist = this.state.playlists.indexOf(this.state.actualPlaylist);
                            let playlists = this.state.playlists;
                            playlists[indexActualPlaylist] = {
                                ...playlist,
                                videos: this.state.actualPlaylist.videos,
                            };
                            await this.setState({ playlists, });
                            this.props.setLoadPlaylistsInVideos(true);
                        }}
                    />
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

export default connect(mapStateToProps, null)(Playlists);