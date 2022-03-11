import React from 'react';
import { Icon, Tooltip } from 'antd';

interface IProps {
    title: string;
    info: string;
}

interface IState {

}

export default class TooltipInput extends React.Component<IProps, IState>{
    render() {
        return (
            <>
                <span>{this.props.title}</span>
                <Tooltip trigger="hover" placement="top" title={this.props.info}>
                    <Icon type="info-circle" theme='filled' style={{ color: '#D3D3D3', marginLeft: 5, marginTop: 3, }}></Icon>
                </Tooltip>
            </>
        )
    }
}