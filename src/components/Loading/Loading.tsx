import React from 'react';
import { Icon } from 'antd';

export default class Loading extends React.Component {
    render() {
        return (
            <div style={{ width: '100%', height: '100vh' }}>

                <Icon type="loading" style={{ fontSize: 100, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}} spin />

            </div>
        )
    }
}