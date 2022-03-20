import React from "react";
import StripeCheckout, { Token } from 'react-stripe-checkout';
// Antd
import { Form, Input, InputNumber, Button, Spin, Modal, Icon } from 'antd';
import { ModalProps } from "antd/lib/modal";
import { FormComponentProps } from 'antd/lib/form/Form';

// Constants
import { REGEX_EMAIL, REGEX_URL } from '../../constants/regex';
import translate from '../../localization';
import { donate } from "../../controllers/sponsors";

interface IProps extends FormComponentProps {
    visible: boolean;
    onCancel: ModalProps['onCancel'];
}

interface IState {
    donationAmount: number;
    loadingForm: boolean;
}

class SponsorsModal extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        this.state = {
            donationAmount: 5,
            loadingForm: false,
        }
    }

    //When the stripe modal submit
    onToken = async (token: Token, amount: number) => {
        this.setState({ loadingForm: true });
        const { onCancel } = this.props;

        try {
            const { data: response } = await donate(token.id, token.email, amount);
            onCancel(null);
        } catch{ }
        
        this.setState({ loadingForm: false });
    };

    componentDidMount() {
        this.props.form.validateFields();
    }

    //Check if one of field has an error
    hasErrors = (fieldsError: Object) => {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    onSubmit = (event: React.FormEvent<any>) => {
        event.preventDefault();
    }

    render() {
        const { donationAmount, loadingForm } = this.state;
        const { form, visible, onCancel } = this.props;
        const { getFieldDecorator, getFieldsError, isFieldTouched, getFieldError } = form;

        // Show error only after a field is touched
        const nameError = isFieldTouched('name') && getFieldError('name');
        const emailError = isFieldTouched('email') && getFieldError('email');
        const amountError = isFieldTouched('amount') && getFieldError('amount');

        return (
            <Modal
                visible={visible}
                onCancel={onCancel}
                centered
                maskClosable={!loadingForm}
                title="Support us"
                footer={[
                    <Button key="1" onClick={onCancel} disabled={loadingForm} style={{ marginRight: 10 }}>Close</Button>,
                    <StripeCheckout
                        key="2"
                        token={(token) => this.onToken(token, donationAmount * 100)}
                        stripeKey="pk_test_FidWKGf2JCahrpY1wmOAo05j"
                        name="Syncodeo"
                        image="https://syncodeo.io/static/media/logo.1d465541.png"
                        panelLabel="Pay"
                        email={form.getFieldValue('email')}
                        amount={donationAmount * 100}
                        currency="EUR"
                        locale="en"
                    >
                        <Button type="primary" disabled={this.hasErrors(getFieldsError()) || loadingForm}><Icon type="credit-card" /> Pay by card</Button>
                    </StripeCheckout>
                ]}
            >
                <Spin spinning={loadingForm}>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Item label="Name" validateStatus={nameError ? 'error' : ''} help={nameError || ''}>
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true,
                                    message: translate('errorRequire'),
                                }]
                            })(
                                <Input placeholder="Syncodeo" autoFocus />
                            )}
                        </Form.Item>
                        <Form.Item label="Email" validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
                            {getFieldDecorator('email', {
                                rules: [{
                                    required: true,
                                    message: translate('errorRequire')
                                }, {
                                    pattern: REGEX_EMAIL,
                                    message: translate('errorEmail', { ex: 'scarren.pro@gmail.com' })
                                }]
                            })(
                                <Input placeholder="scarren.pro@gmail.com" />
                            )}
                        </Form.Item>
                        <Form.Item label="Link">
                            {getFieldDecorator('link', {
                                rules: [{
                                    pattern: REGEX_URL,
                                    message: translate('errorRegexExample', { ex: 'https://syncodeo.io' })
                                }]
                            })(
                                <Input placeholder="https://syncodeo.io" />
                            )}
                        </Form.Item>
                        <Form.Item label="Message">
                            {getFieldDecorator('message')(
                                <Input.TextArea />
                            )}
                        </Form.Item>
                        <Form.Item label="Amount" validateStatus={amountError ? 'error' : ''} help={amountError || ''}>
                            {getFieldDecorator('amount', { initialValue: donationAmount, rules: [{ required: true }] })(
                                <InputNumber
                                    min={1}
                                    step={1}
                                    formatter={value => `€ ${value}`}
                                    onChange={value => this.setState({ donationAmount: value })}
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create<IProps>()(SponsorsModal);