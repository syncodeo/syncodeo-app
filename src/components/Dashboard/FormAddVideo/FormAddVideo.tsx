import './FormAddVideo.less';
import React from 'react';

// Components
import { Form, Tabs, Input, Button, Alert, Spin, Icon, message, } from 'antd';
import Layout from '../../Layout/Layout';

// Constants
import { REGEX_ID_VIDEO_YOUTUBE } from '../../../constants/regex';

// Controllers
import { getRecentVideoUploaded, getVideoInfoFromYoutube, } from '../../../controllers/videos';
import FormEditAddVideo from '../FormEditAddVideo/FormEditAddVideo';

// Interfaces
import Video from '../../../interfaces/Video';
import Table, { ColumnProps } from 'antd/lib/table';
import { getColumnSearchProps } from '../../../helpers/table';
import translate from '../../../localization';
import GridList from '../../Lists/GridList/GridList';
import { NO_DATA_IMAGE } from '../../../constants';
import { bindActionCreators } from 'redux';
import { hideLoading } from 'react-redux-loading-bar';
import { connect } from 'react-redux';
import { FormComponentProps } from 'antd/lib/form';

const FormItem = Form.Item;

interface IProps extends FormComponentProps {
    gridList: boolean;
}

interface IState {
    actualVideo: Video | undefined;
    selectedVideo: Video;
    activeKey: string;
    searchText: string;

    videos?: Video[];
}

class FormAddVideo extends React.Component<IProps, IState> {

    searchInput: React.RefObject<Input> = React.createRef();

    constructor(props: IProps) {
        super(props);

        this.state = {
            videos: undefined,
            selectedVideo: undefined,
            actualVideo: undefined,
            activeKey: '1',
            searchText: '',
        }
    }

    render() {
        const columns: ColumnProps<any>[] = [{
            key: 'image',
            width: '20%',
            render: (video: Video) => (
                video.status === 'private' ? (
                    <img width="100%" src={require('../../../img/videoNotFound.jpg')} />
                ) : (
                        <img width="100%" src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} />
                    )
            )
        }, {
            key: 'title',
            render: (video: Video) => (
                <div style={{ maxHeight: 120, overflow: 'hidden', }}>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                </div>
            ),
            ...getColumnSearchProps('title', this.searchInput, this.handleSearch, this.handleReset),
            width: '60%',
        }, {
            title: translate('visibility'),
            key: 'status',
            dataIndex: 'status',
            filterMultiple: false,
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
            onFilter: (value: string, record: Video) => record.status.indexOf(value) === 0,
        }, {
            title: translate('action'),
            key: 'action',
            render: (video: Video) => {
                return (
                    <ul className="buttons">
                        {/* Bouton d'ajout de la vidéo récente */}
                        <li>
                            {
                                video.registered ?
                                    // Vidéo déjà enregistrée
                                    <Button disabled>
                                        <Icon type="check" /> {translate('alreadyAdded')}
                                    </Button> :
                                    // Vidéo pas encore enregistrée
                                    <Button onClick={() => this.setState({ actualVideo: video, activeKey: '3' })}>
                                        <Icon type="plus" /> {translate('addVideoOnSyncodeo')}
                                    </Button>
                            }
                        </li>


                        {/* Bouton pour visionner la vidéo sur YouTube */}
                        <li>
                            <Button href={'https://www.youtube.com/watch?v=' + video.videoId} ref="noopener noreferrer" target="_blank" color="red">
                                <Icon type="youtube" /> {translate('watchOnYoutube')}
                            </Button>
                        </li>
                    </ul>
                );
            }
        }];

        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <>
                <Alert
                    message={translate('warning')}
                    description={
                        <span>{translate('warningAddedVideoTooRecently')}</span>
                    }
                    type="info"
                    style={{ marginBottom: 15 }}
                />
                <div id="form-video">
                    <Tabs activeKey={this.state.activeKey} type="card" onChange={tab => {
                        this.setState({ activeKey: tab });
                        if (tab === "2" && !this.state.videos) {
                            getRecentVideoUploaded().then((response: any) => {
                                let videos: Video[] = [];
                                for (let video of response.data as Video[]) {
                                    videos.push({
                                        ...video,
                                        key: video.videoId,
                                    });
                                }
                                videos = videos.sort((a, b) => {
                                    if (b.registered) {
                                        return -1;
                                    }
                                    return 1;
                                });
                                this.setState({
                                    videos,
                                });
                            });
                        }
                    }}>
                        <Tabs.TabPane tab={translate('byVideoId')} key="1" style={{ backgroundColor: 'white', padding: 15, }}>
                            <Form layout="inline" onSubmit={this.handleSubmit}>
                                <FormItem label={translate('videoYoutubeId')}>
                                    {getFieldDecorator('videoId', {
                                        rules: [{
                                            required: true,
                                            message: translate('errorRequire')
                                        }, {
                                            pattern: REGEX_ID_VIDEO_YOUTUBE,
                                            message: translate('errorRegexExample', { ex: 'dQw4w9WgXcQ' }),
                                        }],
                                    })(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" htmlType="submit">{this.state.actualVideo ? translate('refresh') : translate('continue')}</Button>
                                </FormItem>
                            </Form>
                            {this.state.selectedVideo && <Table className="table" showHeader={false} locale={{
                                emptyText: (<span>{NO_DATA_IMAGE} <br /> {translate('noData')}</span>) as any,
                            }} dataSource={[this.state.selectedVideo]} columns={columns} pagination={false} />}
                        </Tabs.TabPane>

                        <Tabs.TabPane tab={translate('byMostRecentVideos')} key="2" style={{ backgroundColor: 'white', padding: 15, }} >
                            {this.props.gridList ? (
                                <GridList
                                    type="video"
                                    dataSource={this.state.videos}
                                    onAddYoutubeVideo={video => {
                                        this.setState({ actualVideo: video, activeKey: '3' })
                                    }}
                                    notShowInformations
                                />
                            ) : (
                                    <Form layout="vertical" onSubmit={this.handleSubmit}>
                                        <Table
                                            className="table"
                                            locale={{
                                                emptyText:(
                                                    <span>
                                                        {NO_DATA_IMAGE}<br />
                                                        {translate('noData')}
                                                    </span>
                                                ) as any
                                            }}
                                            dataSource={this.state.videos}
                                            columns={columns}
                                            loading={!this.state.videos}
                                            rowClassName={((record: Video) => record.registered ? 'grey' : '')}
                                            pagination={false}
                                        />
                                    </Form>
                                )}
                        </Tabs.TabPane>
                        {this.state.actualVideo && (
                            <Tabs.TabPane tab={translate('addVideo')} key="3" style={{ backgroundColor: 'white', padding: 15, }}>
                                <FormEditAddVideo video={this.state.actualVideo} type="add" />
                            </Tabs.TabPane>
                        )}
                    </Tabs>
                </div>
            </>
        );
    }

    handleSubmit = (e: any) => {
        e.preventDefault();

        const { form } = this.props;

        form.validateFields((err: any, values: any) => {
            if (err) { return; }

            getVideoInfoFromYoutube(values.videoId).then((response: any) => {
                this.setState({
                    selectedVideo: response.data,
                });
            });
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
}

export default Form.create<IProps>()(FormAddVideo);