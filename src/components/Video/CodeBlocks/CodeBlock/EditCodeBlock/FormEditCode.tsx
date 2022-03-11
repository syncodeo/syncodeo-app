import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import Code from '../../../../../interfaces/Code';
import { generateTreeUrl } from '../../../../../controllers/github';
import { REGEX_GITHUB_FILE } from '../../../../../constants/regex';
import translate from '../../../../../localization';
import TooltipInput from '../../../../TooltipInput/TooltipInput';

interface IProps extends FormComponentProps {
    github: Code['github'];
}

interface IState {

}

class FormEditGithubLink extends React.Component<IProps, IState>{
    render() {
        const { form, github, } = this.props;
        const { getFieldDecorator } = form;
        return (

            <Form>
                <Form.Item label={<TooltipInput title={translate('githubLinkBelow')} info={translate('tooltipGithubCode')} />} colon={false}>
                    {getFieldDecorator('githubLink', {
                        initialValue: github.user ? generateTreeUrl(github) : '',
                        rules: [{ pattern: REGEX_GITHUB_FILE, message: translate('errorRegexExample', {ex: 'https://github.com/facebook/react/blob/master/README.md'}) }]
                    })(
                        <Input placeholder="https://github.com/facebook/react/blob/master/README.md" allowClear />
                    )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create<IProps>()(FormEditGithubLink);