import './PlaylistList.less';

import React from 'react';
import { List, Button, Spin, Card, Icon, } from 'antd';
import Video from '../../../interfaces/Video';
import { Link } from 'react-router-dom';
import { Playlist } from '../../../interfaces/Playlists';
import ResizeObserver from 'resize-observer-polyfill';
import { ColumnCount } from 'antd/lib/list';
import { IActualPlaylistAction, updateActualPlaylist } from '../../../actions/actualPlaylist';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IStateStore } from '../../../interfaces/Store';
import queryString from 'query-string';
import ImageList from '../../Lists/ImageList/ImageList';

interface IProps extends IStateToProps, IDispatchToProps {
    videoId: string;
    playlistUuid: string;
    playlists: Playlist[];
}

interface IState {
    playlistColumn: ColumnCount;
    loading: boolean;
}

class PlaylistList extends React.Component<IProps, IState>{

    resizeObserver: ResizeObserver;

    constructor(props: IProps) {
        super(props);

        this.state = {
            playlistColumn: 2,
            loading: true,
        }
    }

    async componentDidMount() {
        this.resizeObserver = new ResizeObserver(entries => {
            let windowWidth = window.innerWidth;
            let paneWidth = entries[0].contentRect.width;
            const ratio = paneWidth / windowWidth;
            if (ratio <= 0.25) {
                this.setState({ playlistColumn: 1 });
            }
            else if (ratio > 0.25 && ratio <= 0.4) {
                this.setState({ playlistColumn: 2, })
            }
            else if (ratio > 0.4 && ratio <= 0.5) {
                this.setState({ playlistColumn: 3, })
            }
            else if (ratio > 0.5 && ratio <= 1) {
                this.setState({ playlistColumn: 4, })
            }
        });
        this.resizeObserver.observe(document.getElementById('playlists'));

        this.setState({ loading: false, });
    }

    componentWillUnmount() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    render() {
        const { actualPlaylist } = this.props;

        return (
            <Spin spinning={this.state.loading || this.props.loading !== 0}>
                {actualPlaylist && (
                    <div id="playlist-list">
                        <h2 style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>
                            <Icon type="arrow-left" style={{ cursor: 'pointer' }} onClick={() => {
                                let query = queryString.parse(location.search);
                                let newQuery = { ...query, p: undefined };
                                window.history.pushState(null, null, 'watch?' + queryString.stringify(newQuery));
                                this.props.updateActualPlaylist(null);
                            }} />
                            <Link to={"/playlists/" + actualPlaylist.uuid} style={{ marginLeft: 15 }}>
                                {actualPlaylist.title}
                            </Link>
                        </h2>
                        <List
                            itemLayout="horizontal"
                            dataSource={actualPlaylist.videos}
                            renderItem={(item: Video) => (
                                <Link to={"/watch?v=" + item.videoId + '&p=' + actualPlaylist.uuid}>
                                    <List.Item className={item.videoId === this.props.videoId ? 'item active' : 'item'}>
                                        <ImageList type="video" item={item} width={135} height={75} />
                                        <div className="content">
                                            <h3 className="title">{item.title}</h3>
                                            {item.description && (
                                                <>
                                                    <h5 className="description" style={{ whiteSpace: !item.showMore ? 'nowrap' : 'normal' }}>{item.description}</h5>
                                                    <Button onClick={e => {
                                                        e.preventDefault();
                                                        let index = actualPlaylist.videos.indexOf(item);
                                                        let videos = actualPlaylist.videos;
                                                        videos[index].showMore = !videos[index].showMore;
                                                        this.props.updateActualPlaylist({ ...actualPlaylist, videos, });
                                                    }} size="small">{!item.showMore ? 'Show more' : 'Show less'}</Button>
                                                </>
                                            )}
                                        </div>
                                    </List.Item>
                                </Link>
                            )}
                        />
                    </div>
                )}

                <div id="playlists" style={{ display: this.props.actualPlaylist ? 'none' : 'block', padding: 15 }}>
                    <List
                        grid={{ gutter: 16, column: this.state.playlistColumn }}
                        dataSource={this.props.playlists}
                        loading={!this.props.playlists}
                        renderItem={(item: Playlist) => (
                            <List.Item style={{ cursor: 'pointer', }} onClick={() => {
                                this.props.updateActualPlaylist(item);
                                let query = queryString.parse(location.search);
                                let newQuery = { ...query, p: item.uuid };
                                window.history.pushState(null, null, 'watch?' + queryString.stringify(query));
                            }}>
                                <div style={{ border: '1px solid #E7E7E7', padding: 5 }}>
                                    <ImageList type="playlist" item={item} />
                                    <h3 style={{ width: '100%', borderTop: '1px solid #E7E7E7', marginBottom: 2, paddingTop: 10, height: 35, overflow: 'hidden' }}>{item.title}</h3>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            </Spin>
        )
    }
}

interface IStateToProps {
    loading: IStateStore['loading'];
    actualPlaylist: IStateStore['actualPlaylist'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        loading: state.loading,
        actualPlaylist: state.actualPlaylist,
    }
};


interface IDispatchToProps {
    updateActualPlaylist: IActualPlaylistAction['updateActualPlaylist'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateActualPlaylist: bindActionCreators(updateActualPlaylist, dispatch),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PlaylistList);