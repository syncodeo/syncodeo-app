import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import translate from '../../localization';
import { I18n } from '../../localization/default';

interface IProps extends SelectProps {
    values: string[];
    extension?: 'png' | 'svg' | 'jpg';
}

interface IState {

}

export default class SelectImage extends React.Component<IProps, IState> {

    static defaultProps = {
        extension: 'svg',
    } as IProps;

    render() {
        const { values, extension } = this.props;

        return (
            <Select {...this.props} notFoundContent={translate('noData')}>
                {values.map((value) => (
                    <Select.Option value={value} key={value}>
                        <img width="16" src={require('../../img/selectImages/' + value + '.' + extension)} /> {translate(value as keyof I18n)}
                    </Select.Option>
                ))}
            </Select>
        )
    }
}