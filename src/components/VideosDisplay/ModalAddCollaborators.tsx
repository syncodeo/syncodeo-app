import React from 'react';

// Components
import { Form, Select, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import translate from '../../localization';
import Modal, { ModalProps } from 'antd/lib/modal';
import Video from '../../interfaces/Video';
import { editVideo } from '../../controllers/videos';
import { REGEX_EMAIL } from '../../constants/regex';

const FormItem = Form.Item;

interface IProps extends ModalProps, FormComponentProps {
    selectedRows: Video[];
    onUpdated: (video: Video) => void;
    clearSelectedRows: () => void;
}

interface IState {
    loading: number;
}

class ModalAddCollaborators extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: 0,
        }
    }

    render() {
        const { form, } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                {...this.props}
                title={"Add collaborators"}
                okButtonProps={{ htmlType: 'submit' }}
                confirmLoading={this.state.loading !== 0}
                onOk={this.handleSubmit}
            >
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <FormItem label={translate('collaborators')} style={{ marginBottom: 0, }}>
                        {getFieldDecorator('collaborators', {
                            initialValue: [],
                            rules: [{
                                required: false,
                                type: 'array',
                                validator: (rule, values: string[], callback, source, options) => {
                                    let error = undefined;
                                    for (let value of values) {
                                        if (!value.match(REGEX_EMAIL)) {
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
                    </FormItem>
                </Form>
            </Modal>
        )
    }

    handleSubmit = (e: React.FormEvent<any>) => {
        e.preventDefault();

        const { form, selectedRows, onCancel, clearSelectedRows } = this.props;

        form.validateFields(async (err: any, values: { collaborators: string[] }) => {
            if (err) {
                this.setState({ loading: 0, })
                return;
            }

            await this.setState({ loading: selectedRows.length });

            new Promise(async () => {
                for (let video of selectedRows) {
                    try {
                        const { data: updatedVideo } = await editVideo(video.videoId, { collaborators: [...video.collaborators, ...values.collaborators], }, { notShowErrors: ['E-400-00'] });
                        this.props.onUpdated(updatedVideo);
                    } catch{ }

                    await this.setState({ loading: this.state.loading - 1 });
                    if (this.state.loading === 0) {
                        message.success(translate('collaboratorsSuccessfullyAdded'));
                        form.resetFields();
                        clearSelectedRows();
                        onCancel(null);
                    }
                }
            });
        });
    }
}

export default Form.create<IProps>()(ModalAddCollaborators);