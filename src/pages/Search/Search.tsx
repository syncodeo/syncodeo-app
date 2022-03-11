import './Search.less';

import React from 'react';
import { Form, Input, Divider, List, Row, Col, Button, Collapse, Icon, Tag, Radio, Tooltip, } from 'antd';
import { searchVideo, getVideosRecentlyUpdated } from '../../controllers/videos';
import Video from '../../interfaces/Video';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Link, RouteComponentProps } from 'react-router-dom';
import ISearch from '../../interfaces/Search';
import translate from '../../localization';
import queryString from 'query-string';
import { getLocalizations, getDifficulties } from '../../controllers/constants';
import difficulty from "../../localization/en/en-us/difficulty";
import { searchPlaylist } from '../../controllers/playlists';
import { Playlist } from '../../interfaces/Playlists';
import SelectImage from '../../components/SelectImage/SelectImage';
import ImageList from '../../components/Lists/ImageList/ImageList';
import { NO_DATA_IMAGE } from '../../constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ILeftMenuAction, updateLeftMenu } from '../../actions/leftMenu';
import difficultyLocalization from '../../localization/en/en-us/difficulty';
import languageLocalization from '../../localization/en/en-us/language';
import { hideLoading } from 'react-redux-loading-bar';
import { IStateStore } from '../../interfaces/Store';

interface IProps extends IDispatchToProps, IStateToProps, FormComponentProps {
    route: RouteComponentProps;
    className?: string;
}

interface IState {
    initLoading: boolean;
    loading: boolean;
    data: any[];
    list: any[];
    nextPage: number;
    videosRecentlyUpdated?: Video[];
    languages?: any;
    difficulties?: any;
    tags: string[];
    actualType: 'video' | 'playlist';
    showCloseIcon: boolean;
}

interface IQuery {
    query?: string;
    languages?: string[];
    difficulties?: (keyof typeof difficulty)[];
    type?: IState['actualType'];
    feedback?: any;
}

class Search extends React.Component<IProps, IState>{

    query: IQuery = {
        query: '',
        languages: [],
        difficulties: [],
        type: 'video',
    };
    search: ISearch;
    refSearch: Input;

    constructor(props: IProps) {
        super(props);

        this.state = {
            initLoading: true,
            loading: false,
            data: undefined,
            list: [],
            nextPage: null,
            tags: [],
            actualType: 'video',
            showCloseIcon: false,
        }

        props.updateLeftMenu({
            title: "Search",
            icon: 'search',
            selectedKeys: ['search'],
        });
    }

    async componentWillMount() {
        try {
            const { data: videosRecentlyUpdated } = await getVideosRecentlyUpdated();
            const { data: languages } = await getLocalizations();
            const { data: difficulties } = await getDifficulties();

            await this.setState({ videosRecentlyUpdated, initLoading: false, languages, difficulties, });

            this.query = queryString.parse(this.props.route.location.search);
            for (let key of Object.keys(this.query)) {
                try {
                    this.query[key] = JSON.parse(this.query[key]);
                } catch{ }
            }
            if (this.query) {
                // Open left feedback drawer
                if (this.query.feedback !== undefined) {
                    this.props.updateLeftMenu({
                        title: "Search",
                        icon: 'search',
                        selectedKeys: ['search'],
                        openFeedback: true,
                    });
                }
                this.setState({ actualType: this.query.type || 'video' });
                this.generateLink(this.query);
                if (this.query.query) {
                    this.handleSubmit();
                }
            }

        } catch { }
        this.props.hideLoading();
    }

    generateLink(options: IQuery) {
        this.query = { ...this.query, ...options, };
        if (this.query.feedback !== undefined) delete this.query.feedback;
        let search = "search?";
        let tags = [];
        for (let key of Object.keys(this.query)) {
            if (this.query[key] instanceof Array) {
                search += key + "=" + JSON.stringify(this.query[key]) + "&";
                if ((this.query[key] as []).length > 0) {
                    tags.push(key.charAt(0).toUpperCase() + key.slice(1) + ': ' + (this.query[key] as []).map(value => {
                        return this.state[key][value] || translate(value);
                    }));
                }
            } else {
                search += key + "=" + this.query[key] + "&";
                if (key !== 'query') tags.push(key.charAt(0).toUpperCase() + key.slice(1) + ': ' + translate(this.query[key]))
            }
        }
        this.setState({ tags });
        search = search.slice(0, -1);
        window.history.replaceState(null, null, search);
    }

    render() {
        const { initLoading, loading, data, nextPage } = this.state;
        const { isMobile } = this.props;
        const { getFieldDecorator, } = this.props.form;
        const loadMore = data && !initLoading && !loading && nextPage ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px', }}>
                <Button onClick={this.onLoadMore}>{translate('loadMore')}</Button>
            </div>
        ) : null;

        return (
            <div id="search">
                <Form>
                    <Collapse bordered={false}>
                        <Collapse.Panel key="1" header={
                            <span>
                                {translate('filters')}
                                <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 0, top: 0, }}>
                                    <Radio.Group value={this.state.actualType} buttonStyle="solid" size="large" onChange={type => {
                                        this.generateLink({ type: type.target.value });
                                        this.setState({ actualType: type.target.value });
                                    }}>
                                        <Radio.Button value="video">{translate('video')} <Icon type="youtube" /></Radio.Button>
                                        <Radio.Button value="playlist"><Icon type="ordered-list" /> {translate('playlist')}</Radio.Button>
                                    </Radio.Group>
                                </div>
                            </span>
                        }>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label={translate('language')} className="form">
                                        {getFieldDecorator('language', {
                                            initialValue: this.query.languages || [],
                                        })(
                                            <SelectImage showSearch mode="tags" placeholder="Select a language" onChange={(languages: string[]) => {
                                                this.generateLink({ languages });
                                            }} allowClear values={this.state.languages} />
                                        )}
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label={translate('difficulty')} className="form">
                                        {getFieldDecorator('difficulty', {
                                            initialValue: this.query.difficulties || [],
                                        })(
                                            <SelectImage showSearch mode="tags" placeholder="Select a difficulty" onChange={(difficulties: (keyof typeof difficulty)[]) => {
                                                this.generateLink({ difficulties });
                                            }} allowClear values={this.state.difficulties} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                    <Row gutter={12} style={{ marginTop: 15, }}>
                        <Col span={20}>
                            <Form.Item className="form">
                                {getFieldDecorator('query', {
                                    initialValue: this.query.query || '',
                                })(
                                    <Input placeholder={translate('searchQueryPlaceholder')} onChange={e => {
                                        if (e.currentTarget.value.length === 0) {
                                            this.setState({ showCloseIcon: false });
                                        } else if (!this.state.showCloseIcon) {
                                            this.setState({ showCloseIcon: true });
                                        }
                                        this.generateLink({ query: e.currentTarget.value });
                                        if (e.cancelable) {
                                            this.setState({ data: undefined, list: undefined, })
                                        }
                                    }} ref={ref => this.refSearch = ref} addonAfter={this.state.showCloseIcon && <Icon type="close" onClick={async () => {
                                        await this.setState({ actualType: 'video' });
                                        this.refSearch.input.focus();
                                        this.refSearch.input.select();
                                        document.execCommand('delete');
                                        this.refSearch.input.blur();
                                        this.setState({ data: undefined, list: undefined, })
                                    }} />} autoFocus onPressEnter={this.handleSubmit} />
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item className="form">
                                <Button type="primary" icon="search" onClick={this.handleSubmit} style={{ width: '100%', }}>{!isMobile && translate('search')}</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    {this.state.tags.length > 0 ? (
                        <ul className="filters-tags">
                            {this.state.tags.map(tag => <li style={{ display: 'inline', }} key={tag}><Tag>{tag}</Tag></li>)}
                        </ul>
                    ) : <Tag>No filter...</Tag>}
                </Form>
                <Divider>{data ? translate('results') : translate('recentlyUpdated')}</Divider>
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
                    dataSource={data || this.state.videosRecentlyUpdated}
                    loadMore={loadMore}
                    loading={initLoading}
                    footer={null}
                    split
                    renderItem={(item: Video | Playlist) => {
                        let playlist = item as Playlist;
                        let video = item as Video;

                        return (

                            <List.Item className="item">
                                {this.state.actualType === 'video' || !playlist.videos ? (
                                    item.title && (
                                        <Link to={'/watch?v=' + video.videoId}>
                                            <div className="image">
                                                <ImageList type="video" item={item} gridList={false} />
                                            </div>
                                            <div className="texte">
                                                <h2 className="title">{item.title}</h2>
                                                <div className="description">{item.description.split('\n').map((item, i) => <p key={i}>{item}</p>)}</div>
                                                <ul className="tags">
                                                    <ul className="flagAndDifficulty">
                                                        <Tooltip title={"Language: " + translate(video.language as (keyof typeof languageLocalization))}>
                                                            <li><img width="24" src={require('../../img/selectImages/' + item.language + '.svg')} /></li>
                                                        </Tooltip>
                                                        <Tooltip title={"Difficulty: " + translate(video.difficulty as (keyof typeof difficultyLocalization))}>
                                                            <li><img width="24" src={require('../../img/selectImages/' + item.difficulty + '.svg')} /></li>
                                                        </Tooltip>
                                                        {item.tags.length > 0 && <li>|</li>}
                                                    </ul>
                                                    {item.tags.map((tag: any) => <li key={tag}><Tag color="blue">{tag}</Tag></li>)}
                                                </ul>
                                            </div>
                                        </Link>
                                    )
                                ) : (
                                        item.title && (
                                            <Link to={"/playlists/" + playlist.uuid}>
                                                <div className="image">
                                                    <ImageList type="playlist" item={item} gridList={false} />
                                                </div>
                                                <div className="texte">
                                                    <h2 className="title">{item.title}</h2>
                                                    <div className="description">{item.description.split('\n').map((item, i) => <p key={i}>{item}</p>)}</div>
                                                    <ul className="tags">
                                                        <ul className="flagAndDifficulty">
                                                            <Tooltip title={"Language: " + translate(item.language as (keyof typeof languageLocalization))}>
                                                                <li><img width="24" src={require('../../img/selectImages/' + item.language + '.svg')} /></li>
                                                            </Tooltip>
                                                            <Tooltip title={"Difficulty: " + translate(item.difficulty as (keyof typeof difficultyLocalization))}>
                                                                <li><img width="24" src={require('../../img/selectImages/' + item.difficulty + '.svg')} /></li>
                                                            </Tooltip>
                                                            {item.tags.length > 0 && <li>|</li>}
                                                        </ul>
                                                        {item.tags.map((tag: any) => <li key={tag}><Tag color="blue">{tag}</Tag></li>)}
                                                    </ul>
                                                </div>
                                            </Link>
                                        )
                                    )}
                            </List.Item>
                        )
                    }} />
            </div >
        );
    }

    onLoadMore = async () => {
        await this.setState({
            loading: true,
            list: this.state.data.concat([...new Array(10)].map(() => ({ loading: true, }))),
        });



        let results = [];
        let nextPage = null;
        if (this.state.actualType === 'video') {
            const { data: response } = await searchVideo({ ...this.search, page: this.state.nextPage });
            results = response.results;
            nextPage = response.nextPage;
        }
        else {
            const { data: response } = await searchPlaylist({ ...this.search, page: this.state.nextPage });
            results = response.results;
            nextPage = response.nextPage;
        }
        const data = this.state.data.concat(results);
        await this.setState({
            data,
            list: data,
            loading: false,
            nextPage,
        });
    }

    handleSubmit = (event?: any) => {
        if (event) event.preventDefault();
        this.props.form.validateFields(async (error: any, values: { difficulty: string, language: string, query: string, type: string }) => {
            if (error) {
                this.setState({ initLoading: false, });
                return;
            }

            if (values.query) {
                await this.setState({ initLoading: true, nextPage: 1 });
                this.search = {
                    difficulty: values.difficulty,
                    language: values.language,
                    query: values.query,
                    page: this.state.nextPage,
                }
                if (this.state.actualType === 'video') {
                    try {
                        const { data: response } = await searchVideo(this.search);
                        await this.setState({
                            data: response.results,
                            list: response.results,
                            nextPage: response.nextPage,
                        });
                    } catch{ }
                }
                else if (this.state.actualType === 'playlist') {
                    try {
                        const { data: response } = await searchPlaylist(this.search);
                        await this.setState({
                            data: response.results,
                            list: response.results,
                            nextPage: response.nextPage,
                        });
                    } catch{ }
                }

                this.setState({ initLoading: false });
            }
        });
    }
}

interface IStateToProps {
    isMobile: IStateStore['isMobile'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        isMobile: state.isMobile
    };
};

interface IDispatchToProps {
    updateLeftMenu: ILeftMenuAction['updateLeftMenu'];
    hideLoading: typeof hideLoading;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateLeftMenu: bindActionCreators(updateLeftMenu, dispatch),
        hideLoading: bindActionCreators(hideLoading, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<IProps>()(Search));