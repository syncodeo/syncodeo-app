import React from 'react';

import { Icon } from 'antd';

interface IProps{
    visible: boolean;
}

interface IState{

}

export default class Loading extends React.Component<IProps, IState> {

    render() {
        return (
            <div style={{ width: '100%', height: '100vh', backgroundColor: '#262626', position: 'relative', display: this.props.visible ? 'block' : 'none' }}>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Icon type="loading" style={{ color: 'white', fontSize: '150px' }} />
                </div>
            </div>
        );
    }
}