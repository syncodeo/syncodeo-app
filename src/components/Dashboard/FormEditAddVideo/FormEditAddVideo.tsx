import React from 'react';

// Components
import { Form, Input, Select, Col, Row, Radio, Button, Icon, Checkbox, } from 'antd';
import { addVideo, editVideo, getVideoInfoFromYoutube } from '../../../controllers/videos';
import Video from '../../../interfaces/Video';
import { Redirect } from 'react-router';
import { REGEX_GITHUB, REGEX_EMAIL } from '../../../constants/regex';
import translate from '../../../localization';
import TooltipInput from '../../TooltipInput/TooltipInput';
import { getDifficulties, getLocalizations } from '../../../controllers/constants';
import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import { FormComponentProps } from 'antd/lib/form/Form';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import SelectImage from '../../SelectImage/SelectImage';

interface IProps extends FormComponentProps {
    type: 'add' | 'edit';
    index?: number;
    video?: Video;
    onUpdated?: (video: Video) => void;
    modalProps?: ModalProps;
}

interface IState {
    redirectToVideo: boolean;
    loading: boolean;
    languages: string[];
    difficulties: string[];
    video: Video;

    //Syncro
    synchronizeLoading: boolean;
    showModalSyncro: boolean;
    checkedList: CheckboxValueType[];
    indeterminate: boolean;
    checkAll: boolean;
}

declare global {
    interface Array<T> {
        includesLowerCase(value: any): boolean;
    }
}

class FormEditAddVideo extends React.Component<IProps, IState> {

    actualVideo: Video | undefined = undefined;
    refInputTags: React.RefObject<Input> = React.createRef();

    constructor(props: IProps) {
        super(props);
        this.state = {
            redirectToVideo: false,
            loading: false,
            languages: [],
            difficulties: [],
            // Syncro
            synchronizeLoading: false,
            showModalSyncro: false,
            checkedList: ['Description'],
            indeterminate: true,
            checkAll: false,
            video: props.video,
        }

        Array.prototype.includesLowerCase = function (value: any) {
            for (var v of this) {
                if (value.toLowerCase() === v.toLowerCase()) {
                    return true;
                }
            }
            return false;
        }
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (this.props.video !== nextProps.video) {
            this.props.form.resetFields();
            this.setState({ video: nextProps.video });
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        try {
            const { data: languages } = await getLocalizations();
            const { data: difficulties } = await getDifficulties();

            await this.setState({ languages, difficulties });
        } catch{ }
        this.setState({ loading: false });
    }

    render() {
        const { form, type } = this.props;
        const { video } = this.state;
        const { getFieldDecorator } = form;

        const FormRender = (
            <Form layout="vertical" onSubmit={this.handleSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label={<TooltipInput title={translate('title')} info={translate('tooltipTitleVideo')} />}>
                            {getFieldDecorator('title', {
                                initialValue: video ? video.title : '',
                                rules: [{ required: true, message: translate('errorRequire') }]
                            })(
                                <Input placeholder={translate('chooseTitle')} />
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label={<TooltipInput title={translate('visibility')} info={translate('tooltipVisibility')} />} extra={
                            <>
                                <Icon type="warning" style={{ marginRight: 5, }}></Icon>
                                <span>{translate('warningPrivateSyncodeo')}</span>
                            </>
                        }>
                            {getFieldDecorator('visibility', {
                                initialValue: video ? (video.status === 'private' ? 'private' : video.status) || video.visibility : 'public',
                                rules: [{ required: true, }],
                            })(
                                <Radio.Group style={{ width: '100%', textAlign: 'center' }}>
                                    <Radio.Button disabled={type === 'add' && video.status === 'private'} value="public" style={{ width: 'calc(100% / 3)' }}>{translate('public')}</Radio.Button>
                                    <Radio.Button value="private" style={{ width: 'calc(100% / 3)' }}>{translate('private')}</Radio.Button>
                                    <Radio.Button disabled={type === 'add' && video.status === 'private'} value="unlisted" style={{ width: 'calc(100% / 3)' }}>{translate('unlisted')}</Radio.Button>
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label={<TooltipInput title={translate('language')} info={translate('tooltipLanguageVideo')} />}>
                            {getFieldDecorator('language', {
                                initialValue: video ? video.language : '',
                                rules: [{ required: true, }],
                            })(
                                <SelectImage showSearch placeholder="Select a language" values={this.state.languages} />
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label={<TooltipInput title={translate('difficulty')} info={translate('tooltipDifficulty')} />}>
                            {getFieldDecorator('difficulty', {
                                initialValue: video ? video.difficulty : undefined,
                                rules: [{ required: true, }],
                            })(
                                <SelectImage showSearch placeholder="Select a difficulty" values={this.state.difficulties} />
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label={<TooltipInput title={translate('collaborators')} info={translate('tooltipCollaborators')} />}>
                            {getFieldDecorator('collaborators', {
                                initialValue: video ? video.collaborators ? video.collaborators : [] : [],
                                rules: [{
                                    required: false,
                                    type: 'array',
                                    validator: async (rule, values: string[], callback, source, options) => {
                                        let error = undefined;
                                        for(let value of values){
                                            if(!value.match(REGEX_EMAIL)){
                                                error = translate('errorEmail');
                                                break;
                                            }
                                        }
                                        callback(error);
                                    }
                                }]
                            })(
                                <Select
                                    autoFocus
                                    mode="tags"
                                    tokenSeparators={[',']}
                                    style={{ width: '100%', }}
                                    placeholder="collaborator1@gmail.com"
                                    dropdownStyle={{ display: 'none' }}
                                />
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label={<TooltipInput title={translate('tags')} info={translate('tooltipTags')} />}>
                            {getFieldDecorator('tags', {
                                initialValue: video ? video.tags ? video.tags : [] : [],
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
                        <Form.Item label={<TooltipInput title={translate('description')} info={translate('tooltipDescription')} />}>
                            {getFieldDecorator('description', {
                                initialValue: video ? video.description : '',
                            })(
                                <Input.TextArea autosize={{ minRows: 5, maxRows: 5, }} style={{ overflow: 'auto', }} />
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label={<TooltipInput title={translate('smthLink', { smth: 'GitHub' })} info={translate('tooltipGithubLink')} />}>
                            {getFieldDecorator('github', {
                                initialValue: video ? video.github || '' : '',
                                rules: [{ pattern: REGEX_GITHUB, message: translate('errorRegexExample', { ex: 'https://github.com/facebook/react' }) }]
                            })(
                                <Input placeholder="https://github.com/facebook/react" />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                {this.props.type === 'add' && (
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0, }}>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}>{translate('addVideo')}</Button>
                    </Form.Item>
                )}
            </Form>
        )

        // Checkboxs to syncronize with youtube data
        const plainOptions = ['Title', 'Visibility', 'Description'];

        return (
            <>
                {this.state.redirectToVideo && this.state.video && <Redirect to={"/watch?v=" + this.state.video.videoId} />}
                {this.props.type === 'edit' && (
                    <Modal
                        destroyOnClose
                        visible={this.state.showModalSyncro}
                        title="Synchronize with YouTube data"
                        onCancel={() => this.setState({ showModalSyncro: false, })}
                        confirmLoading={this.state.synchronizeLoading}
                        okText={"Synchronize"}
                        onOk={async () => {
                            this.setState({ synchronizeLoading: true, });
                            const { form } = this.props;
                            const { video, checkedList } = this.state;
                            try {
                                if (checkedList.length > 0) {
                                    const { data: updatedVideo } = await getVideoInfoFromYoutube(video.videoId);
                                    const changeTitle = checkedList.includes('Title');
                                    const changeVisibility = checkedList.includes('Visibility');
                                    const changeDescription = checkedList.includes('Description');
                                    await this.setState({
                                        video: {
                                            ...video,
                                            title: changeTitle ? updatedVideo.title : video.title,
                                            visibility: changeVisibility ? updatedVideo.status : video.visibility,
                                            description: changeDescription ? updatedVideo.description : video.description,
                                        },
                                        showModalSyncro: false,
                                    });
                                    if (changeTitle) form.resetFields(['title']);
                                    if (changeVisibility) form.resetFields(['visibility']);
                                    if (changeDescription) form.resetFields(['description']);
                                }
                            } catch{ }

                            this.setState({ synchronizeLoading: false, });
                        }}
                    >
                        <div>
                            <h3 style={{ marginBottom: 15, }}>What do you want to synchronize?</h3>
                            <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                                <Checkbox
                                    indeterminate={this.state.indeterminate}
                                    onChange={(e) => {
                                        this.setState({
                                            checkedList: e.target.checked ? plainOptions : [],
                                            indeterminate: false,
                                            checkAll: e.target.checked,
                                        })
                                    }}
                                    checked={this.state.checkAll}
                                >
                                    Check all
                            </Checkbox>
                            </div>
                            <br />
                            <Checkbox.Group options={plainOptions} value={this.state.checkedList} onChange={(checkedList) => {
                                this.setState({
                                    checkedList,
                                    indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
                                    checkAll: checkedList.length === plainOptions.length,
                                });
                            }} />
                        </div>
                    </Modal>
                )}
                {this.props.modalProps ? (
                    <Modal {...this.props.modalProps} footer={(
                        <>
                            <Button onClick={this.props.modalProps.onCancel}>{translate('cancel')}</Button>
                            <Button type="dashed" onClick={() => this.setState({ showModalSyncro: true })}>Synchronize with YouTube data</Button>
                            <Button type="primary" onClick={this.handleSubmit} htmlType="submit" loading={this.state.loading}>{translate('updateVideo')}</Button>
                        </>
                    )}>
                        {FormRender}
                    </Modal>
                ) : FormRender}
            </>
        )
    }

    handleSubmit = (e: React.FormEvent<any>) => {
        this.setState({ loading: true, });

        e.preventDefault();

        const { form, type, } = this.props;
        const { video } = this.state;

        form.validateFields(async (err: any, values: Video) => {
            if (err) {
                this.setState({ loading: false, })
                return;
            }

            if (type === 'add') {
                try {
                    await addVideo({ ...values, videoId: video.videoId });
                    this.setState({ redirectToVideo: true, });
                } catch{ }
            } else if (type === "edit") {
                try {
                    const { data: editedVideo } = await editVideo(video.videoId, values);
                    this.props.onUpdated(editedVideo);
                    this.props.modalProps.onCancel(null);
                } catch{ }
            }

            this.setState({ loading: false, });
        });
    }
}

export default Form.create<IProps>()(FormEditAddVideo);