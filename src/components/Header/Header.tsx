// React
import React from 'react';

// Components
import { Icon, Layout, } from 'antd';

interface IProps {
    title?: string;
    icon?: string;
    onClickIcon?: () => void;
    style: React.CSSProperties;
}

interface IState {

}

export default class Header extends React.Component<IProps, IState> {

    render() {
        return (
            <Layout.Header style={{ ...this.props.style, background: '#fff', padding: 0 }}>
                {this.props.icon && (
                    <Icon
                        onClick={this.props.onClickIcon}
                        className="trigger"
                        style={{ pointerEvents: this.props.onClickIcon ? 'auto' : 'none', cursor: this.props.onClickIcon ? 'pointer' : 'default' }}
                        type={this.props.icon}
                    />
                )}
                {this.props.title && (
                    <h1 style={{ display: 'inline-block', marginLeft: this.props.icon ? null : 75 }}>{this.props.title}</h1>
                )}
            </Layout.Header>
        )
    }
}