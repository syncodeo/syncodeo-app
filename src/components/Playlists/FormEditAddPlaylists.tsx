// React
import React from 'react';
import { Modal, Form, Input, Radio, Select, Row, Col, Spin, Icon, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import translate from '../../localization';
import { Playlist } from '../../interfaces/Playlists';
import { ModalProps } from 'antd/lib/modal';
import { addPlaylist, addVideoToPlaylist, editPlaylist } from '../../controllers/playlists';
import { History } from 'history';
import Video from '../../interfaces/Video';
import { getLocalizations, getDifficulties } from '../../controllers/constants';
import SelectImage from '../SelectImage/SelectImage';

interface IProps extends ModalProps, FormComponentProps {
    playlist?: Playlist;
    history?: History;
    videoId?: string;
    videos?: Video[];
    onEditPlaylist?: (playlist: Playlist) => void;
    onAddedPlaylist?: (playlist: Playlist) => void;
}

interface IState {
    modalLoading: boolean;
    confirmLoading: boolean;
    languages: string[];
    difficulties: string[];
}

class FormEditAddPlaylists extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            confirmLoading: false,
            modalLoading: true,
            languages: [],
            difficulties: [],
        }
    }

    async componentDidMount() {
        try {
            const { data: languages } = await getLocalizations();
            const { data: difficulties } = await getDifficulties();
            this.setState({ languages, difficulties, modalLoading: false, });
        } catch{ }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { playlist, onCancel } = this.props;
        const { confirmLoading } = this.state;

        return (
            <Modal
                {...this.props}
                onCancel={(e) => {
                    onCancel(e);
                    this.setState({ confirmLoading: false });
                }}
                centered
                width="70%"
                okButtonProps={{ htmlType: 'submit' }}
                onOk={this.handleSubmit}
                confirmLoading={confirmLoading}
            >
                <Spin spinning={this.state.modalLoading} indicator={<Icon type="loading" />}>
                    <Form layout="vertical" onSubmit={this.handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={translate('title')}>
                                    {getFieldDecorator('title', {
                                        rules: [{ required: true }],
                                        initialValue: playlist ? playlist.title : '',
                                    })(
                                        <Input autoFocus placeholder="Title" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={translate('visibility')}>
                                    {getFieldDecorator('visibility', {
                                        initialValue: playlist ? playlist.visibility : 'public',
                                        rules: [{ required: true, }],
                                    })(
                                        <Radio.Group style={{ width: '100%', textAlign: 'center', }}>
                                            <Radio.Button value="public" style={{ width: 'calc(100% / 3)' }}>{translate('public')}</Radio.Button>
                                            <Radio.Button value="private" style={{ width: 'calc(100% / 3)' }}>{translate('private')}</Radio.Button>
                                            <Radio.Button value="unlisted" style={{ width: 'calc(100% / 3)' }}>{translate('unlisted')}</Radio.Button>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={translate('language')}>
                                    {getFieldDecorator('language', {
                                        initialValue: playlist ? playlist.language : undefined,
                                        rules: [{ required: true, }],
                                    })(
                                        <SelectImage showSearch placeholder="Select a language" values={this.state.languages} />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label={translate('difficulty')}>
                                    {getFieldDecorator('difficulty', {
                                        initialValue: playlist ? playlist.difficulty : undefined,
                                        rules: [{ required: true, }],
                                    })(
                                        <SelectImage showSearch placeholder="Select a difficulty" values={this.state.difficulties} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={translate('tags')}>
                                    {getFieldDecorator('tags', {
                                        initialValue: playlist ? playlist.tags ? playlist.tags : [] : [],
                                        rules: [{ required: false, type: 'array', max: 5, }]
                                    })(
                                        <Select
                                            mode="tags"
                                            tokenSeparators={[',']}
                                            style={{ width: '100%', }}
                                            placeholder="C++"
                                            dropdownStyle={{ display: 'none' }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label={translate('description')}>
                                    {getFieldDecorator('description', {
                                        initialValue: playlist ? playlist.description : '',
                                    })(
                                        <Input.TextArea autosize={{ minRows: 3, maxRows: 8, }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal >
        )
    }

    handleSubmit = (event: React.FormEvent<any>) => {
        this.setState({ confirmLoading: true });
        event.preventDefault();
        const { form, playlist, videos, history, onCancel, onEditPlaylist: onHandleSubmit, videoId, onAddedPlaylist } = this.props;

        form.validateFields(async (error, values: Playlist) => {
            if (error) {
                this.setState({ confirmLoading: false, });
                return;
            }

            if (playlist) {
                // Edit playlist
                try {
                    const { data: editedPlaylist } = await editPlaylist(playlist.uuid, values);
                    onHandleSubmit(editedPlaylist);
                    onCancel(null);
                    form.resetFields();
                } catch{ }
            }
            else {
                // Add playlist
                if (videoId) {
                    try {
                        const { data: addedPlaylist } = await addPlaylist(values);
                        await addVideoToPlaylist(addedPlaylist.uuid, videoId);
                        message.success('Video added to the playlist just created');
                        form.resetFields();
                        onAddedPlaylist(addedPlaylist);
                        onCancel(null);
                    } catch{ }
                }
                else if (videos) {
                    try {
                        const { data: addedPlaylist } = await addPlaylist(values);
                        for (let video of videos) {
                            await addVideoToPlaylist(addedPlaylist.uuid, video.videoId);
                        }
                        form.resetFields();
                        history.push('/playlists/' + addedPlaylist.uuid);
                        onCancel(null);
                    } catch{ }
                }
            }

            await this.setState({ confirmLoading: false, });
        });
    }
}

export default Form.create<IProps>()(FormEditAddPlaylists);