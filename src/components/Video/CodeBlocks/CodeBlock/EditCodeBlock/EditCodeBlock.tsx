import './EditCodeBlock.less';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Components
import { Form, Input, Select, Button, message, Row, Col, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
// Helpers
import { languageToColor } from '../../../../../controllers/languages';
// Actions
import { ICodesAction, updateCode } from '../../../../../actions/codes';
// Interfaces
import Code from '../../../../../interfaces/Code';
import { IStateStore } from '../../../../../interfaces/Store';
// Controllers
import { generateDownloadUrl, explodeCodeGitHub, downloadFile } from '../../../../../controllers/github';
import { updateCodeBDD } from '../../../../../controllers/codes';
import YouTubeController from '../../../../../controllers/youtube';
import MonacoController from '../../../../../controllers/monacoEditor';
import FormEditGithubLink from './FormEditCode';
import { IActiveEditCodeIndexAction, updateActiveEditCodeIndex } from '../../../../../actions/activeEditCodeIndex';
import translate from '../../../../../localization';
import { IActualMonacoModelAction, updateActualMonacoModel } from '../../../../../actions/actualMonacoModel';
import TooltipInput from '../../../../TooltipInput/TooltipInput';
import { IPreviousLanguageAction, updatePreviousLanguage } from '../../../../../actions/previousLanguage';
import { getLanguages } from '../../../../../controllers/languages';

interface IProps extends IStateToProps, IDispatchToProps, FormComponentProps {
    code: Code;
    codeIndex: number;
}

interface IState {
    showGithubModal: boolean;
    confirmLoading: boolean;
    editLoading: boolean;
    alreadyGithubLink: boolean;

    height: string;
    padding: string;
    borderWidth: string;
}

class EditCodeBlock extends React.Component<IProps, IState>{

    formRef: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            alreadyGithubLink: props.code.github && props.code.github.user !== null,
            showGithubModal: false,
            confirmLoading: false,
            editLoading: false,

            height: '0px',
            padding: '0px',
            borderWidth: '0px',
        }
    }

    componentDidUpdate() {
        if (this.props.activeEditCodeIndex === this.props.codeIndex && this.state.height === "0px") {
            this.setState({ height: '180px', padding: '15px', borderWidth: '3px', });
        }
        else if (this.props.activeEditCodeIndex !== this.props.codeIndex && this.state.height === "180px") {
            this.setState({ height: '0px', padding: '0px', borderWidth: '0px', })
        }
    }

    render() {
        const { code, form, } = this.props;
        const { getFieldDecorator, } = form;
        const { alreadyGithubLink } = this.state;

        return (
            <li className="code-block-edit" style={{
                border: this.state.borderWidth + ' solid ' + languageToColor(code.mode),
                height: this.state.height,
                padding: this.state.padding,
            }}>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item label={<TooltipInput title={translate('title')} info={translate('tooltipTitleCode')} />}>
                                {getFieldDecorator('title', {
                                    initialValue: code.title,
                                    rules: [{ required: true, message: translate('errorRequire') }]
                                })(
                                    <Input placeholder={translate('chooseTitle')} onFocus={e => e.currentTarget.select()} autoFocus />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label={<TooltipInput title={translate('language')} info={translate('tooltipLanguageCode')} />}>
                                {getFieldDecorator('mode', {
                                    initialValue: code.mode,
                                    rules: [{ required: true, }]
                                })(
                                    <Select
                                        notFoundContent={translate('noData')}
                                        showSearch
                                        placeholder={translate('chooseLanguage')}
                                        optionFilterProp="key"
                                        filterOption={(input: any, option: any) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {getLanguages().map((language) => (
                                            <Select.Option key={language.aliases.join("")} value={language.id}>{language.aliases[0]}</Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button
                                icon="github"
                                style={{ width: '100%', }}
                                onClick={() => this.setState({ showGithubModal: true, })}
                            >
                                {alreadyGithubLink ? translate('editGithubFile') : translate('linkGithubFile')}
                            </Button>
                        </Col>
                        <Col span={12}><Button loading={this.state.editLoading} htmlType="submit" type="primary" style={{ width: '100%', }} >{translate('edit')}</Button></Col>
                    </Row>
                </Form>

                <Modal
                    visible={this.state.showGithubModal}
                    confirmLoading={this.state.confirmLoading}
                    onOk={this.handleGithubSubmit}
                    onCancel={() => {
                        this.formRef.props.form.resetFields();
                        this.setState({ showGithubModal: false, });
                    }}
                    title={translate('linkGithubFile')}
                >
                    <FormEditGithubLink
                        wrappedComponentRef={formRef => this.formRef = formRef}
                        github={code.github}
                    />
                </Modal>
            </li>
        )
    }

    handleSubmit = (event: React.FormEvent<any>) => {
        event.preventDefault();
        this.setState({ editLoading: true, });

        const { code, codeIndex, form, updateCode, updateActiveEditCodeIndex, } = this.props;

        form.validateFields(async (error, values: Code) => {
            if (error) {
                this.setState({ editLoading: false, });
                return;
            }

            try {
                const { data: updatedCode } = await updateCodeBDD(values, YouTubeController.videoId, code.uuid);
                this.props.updatePreviousLanguage(updatedCode.mode);
                updateCode({
                    title: updatedCode.title,
                    mode: updatedCode.mode,
                }, codeIndex);
                MonacoController.updateCodeModel(code.uuid, updatedCode.value, updatedCode.mode);
            } catch{ }

            this.setState({ editLoading: false, });
            updateActiveEditCodeIndex(null);
        });
    }

    handleGithubSubmit = (event: React.FormEvent<any>) => {
        event.stopPropagation();
        this.setState({ confirmLoading: true });

        const { code, updateCode, codeIndex, activeCodeIndex, updateActualMonacoModel } = this.props;
        const formGithub: FormComponentProps['form'] = this.formRef.props.form;

        formGithub.validateFields(async (error, values) => {
            if (error) {
                this.setState({ confirmLoading: false, });
                return;
            };

            if (values.githubLink === '') {
                this.setState({
                    alreadyGithubLink: false,
                    confirmLoading: false,
                    showGithubModal: false,
                });
                try {
                    const { data: updatedCode } = await updateCodeBDD({
                        githubLink: '',
                        value: translate('pasteCodeHere'),
                    }, YouTubeController.videoId, code.uuid);
                    updateCode({ github: { user: null, branch: null, path: null, repository: null }, value: updatedCode.value, }, codeIndex);
                    MonacoController.updateCodeModel(code.uuid, updatedCode.value, updatedCode.mode);
                    if (this.props.actualMonacoModel === MonacoController.models[updatedCode.uuid].model) MonacoController.setReadOnly(false);
                } catch{ }
                return;
            }

            // Update le code avec un fichier github
            // Génération du lien de téléchargement du fichier
            let codeGitHub = explodeCodeGitHub(values.githubLink);
            let downloadGithubLink = generateDownloadUrl(codeGitHub);
            // Téléchargement du fichier
            try {
                const { data } = await downloadFile(downloadGithubLink);
                let contentGitHub = data;
                const { data: updatedCode } = await updateCodeBDD({ githubLink: downloadGithubLink, }, YouTubeController.videoId, code.uuid);
                updateCode({
                    value: contentGitHub,
                    github: updatedCode.github,
                }, codeIndex);
                this.setState({ showGithubModal: false, alreadyGithubLink: true, });
                MonacoController.updateCodeModel(updatedCode.uuid, contentGitHub, updatedCode.mode, true);
                if (this.props.actualMonacoModel === MonacoController.models[updatedCode.uuid].model) MonacoController.setReadOnly(true);
            } catch{ }

            this.setState({ confirmLoading: false, });
        });
    }
}

interface IStateToProps {
    activeCodeIndex: IStateStore['activeCodeIndex'];
    activeEditCodeIndex: IStateStore['activeEditCodeIndex'];
    actualMonacoModel: IStateStore['actualMonacoModel'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        activeCodeIndex: state.activeCodeIndex,
        activeEditCodeIndex: state.activeEditCodeIndex,
        actualMonacoModel: state.actualMonacoModel,
    };
};

interface IDispatchToProps {
    updateCode: ICodesAction['updateCode'];
    updateActiveEditCodeIndex: IActiveEditCodeIndexAction['updateActiveEditCodeIndex'];
    updateActualMonacoModel: IActualMonacoModelAction['updateActualMonacoModel'];
    updatePreviousLanguage: IPreviousLanguageAction['updatePreviousLanguage'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateCode: bindActionCreators(updateCode, dispatch),
        updateActiveEditCodeIndex: bindActionCreators(updateActiveEditCodeIndex, dispatch),
        updateActualMonacoModel: bindActionCreators(updateActualMonacoModel, dispatch),
        updatePreviousLanguage: bindActionCreators(updatePreviousLanguage, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create<IProps>()(EditCodeBlock));