import './FeedbackDrawer.css';

import React from 'react';
import { Button, Form, Radio, Select, Input, Drawer, message, Divider, Icon, Spin, } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { sendFeedback } from '../../../controllers/feedback';
import translate from '../../../localization';
import { IStateStore } from '../../../interfaces/Store';
import { connect } from 'react-redux';
import Login from '../../Login/Login';
import { FormComponentProps } from 'antd/lib/form/Form';

interface IProps extends IStateToProps, FormComponentProps {
    className?: string;
    showFeedbackDrawer: boolean;
    onCloseFeedbackDrawer: () => void;
}

interface IState {
    fileList: UploadFile[];
    loading: boolean;
}

class FeedbackDrawer extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
            fileList: [],
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const form = (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item label={translate('feedbackPage')} style={{ marginBottom: 0 }}>
                    {getFieldDecorator('page', { initialValue: 'Home' })(
                        <Select>
                            <Select.Option value="Home">{translate('home')}</Select.Option>
                            <Select.Option value="Watch">{translate('watch')}</Select.Option>
                            <Select.Option value="Add a video">{translate('addVideo')}</Select.Option>
                            <Select.Option value="Your videos">{translate('yourVideos')}</Select.Option>
                            <Select.Option value="Collaboratives videos">{translate('collaborativesVideo')}</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label={translate('feedbackType')} style={{ marginBottom: 0, }}>
                    {getFieldDecorator('type', { initialValue: 'message' })(
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="message">{translate('message')}</Radio.Button>
                            <Radio.Button value="bug">{translate('bug')}</Radio.Button>
                            <Radio.Button value="feature">{translate('feature')}</Radio.Button>
                            <Radio.Button value="improvement">{translate('improvement')}</Radio.Button>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item label={translate('yourMessage')}>
                    {getFieldDecorator('message', {
                        rules: [{
                            required: true,
                            message: translate('errorTextArea'),
                            max: 2048
                        }],
                    })(
                        <Input.TextArea autosize={{ minRows: 5, maxRows: 5, }} maxLength={2048} />
                    )}
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: 10 }} loading={this.state.loading}>
                    {translate('sendFeedback')}
                </Button>
            </Form>
        )

        return (
            <Drawer
                visible={this.props.showFeedbackDrawer}
                placement="left"
                title={<span style={{ marginLeft: 15 }}>{translate('contacts')}</span>}
                width={400}
                onClose={this.props.onCloseFeedbackDrawer}
            >
                <Button size="large" type="primary" style={{ marginTop: 10, backgroundColor: '#5865F2' }} block={true} href="https://discord.gg/aASfZvxC" target="_blank">
                    <Icon type="message" theme="filled" style={{ position: 'absolute', left: 15, fontSize: 24, marginTop: 7, }} />
                    {/* <img width="24" style={{ marginRight: 5 }} src={require('../../img/discord.svg')} /> */}
                    Join us on Discord!
                </Button>
                <Button size="large" type="primary" style={{ marginTop: 15, backgroundColor: '#38A1F3' }} block={true} href="https://twitter.com/syncodeo" target="_blank">
                    <Icon type="twitter" style={{ position: 'absolute', left: 15, fontSize: 24, marginTop: 7 }} />
                    DM are enabled!
                </Button>
                <Button size="large" type="primary" style={{ marginTop: 15, backgroundColor: '#D44638' }} block={true} href="mailto:scarren.pro@gmail.com">
                    <Icon type="mail" theme="filled" style={{ position: 'absolute', left: 15, fontSize: 24, marginTop: 7 }} />
                    Email us!
                </Button>

                <Divider>{translate('fastFeedback')}</Divider>

                {this.props.isLogged ? form : (
                    <Login needLoggedIn>{form}</Login>
                )}
            </Drawer>
        )
    }

    handleSubmit = (event: any) => {
        this.setState({ loading: true, });
        event.preventDefault();
        this.props.form.validateFields(async (error: any, values: any) => {
            if (error) {
                this.setState({ loading: false, });
                return;
            }

            try {
                await sendFeedback(values);
                this.props.form.resetFields();
                this.props.onCloseFeedbackDrawer();
                message.success(translate('thanksFeedback'));
            } catch{ }

            this.setState({ loading: false, fileList: [], });
        });
    }
}

interface IStateToProps {
    isLogged: IStateStore['isLogged'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        isLogged: state.isLogged,
    }
};

export default connect(mapStateToProps, null)(Form.create<IProps>()(FeedbackDrawer));