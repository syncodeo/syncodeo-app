// React
import React from 'react';

// Socket.IO
import IO from 'socket.io-client';

// Components
import { List, Avatar } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { SOCKET_IO_HOST, SOCKET_IO_PATH } from '../../../constants/env';
import translate from '../../../localization';

interface IProps {
    style?: React.CSSProperties;
}

interface EventData{
    type: 'ADD_VIDEO' | 'UPDATE_VIDEO' | 'ADD_CODE' | 'UPDATE_CODE';
    user: string;
    thumbnail: string;
    video: string;
    date: Date;
}

interface IState {
    events: EventData[];
    size: number;
}

export default class RealtimeEvents extends React.Component<IProps, IState> {

    socket: SocketIOClient.Socket;

    constructor(props){
        super(props);
        this.socket = IO(SOCKET_IO_HOST, { path: SOCKET_IO_PATH });

        this.state = {
            events: [],
            size: 0
        };
        
        this.socket.on('EVENTS', (data) => {
            this.setState({
                events: data.events,
                size: data.size
            })
        });
        this.socket.on('EVENT', (data) => {
            let newEvents = this.state.events;
            if(newEvents.length === this.state.size) newEvents.shift();
            newEvents.push(data);
            this.setState({
                events: newEvents
            });
        });
    }

    componentWillUnmount(){
        this.socket.close();
    }

    render() {
        return (
            <QueueAnim style={{ height: 500, overflow: 'hidden', position: 'relative', ...this.props.style }}>
            {
                this.state.events.slice().reverse().map(event => (
                    <List.Item key={new Date(event.date).getTime()}>
                        <List.Item.Meta
                            avatar={<Avatar src={event.thumbnail} />}
                            title={<a href={'/watch?v=' + event.video}><b>{event.user}</b> {eventToString(event)}</a>}
                            description={new Date(event.date).toLocaleString()}
                        />
                    </List.Item>
                ))
            }
            <div style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)', position: 'absolute', height: 150, left: 0, right: 0, bottom: 0}} />
            </QueueAnim>
        );
    }
}

function eventToString(event: EventData){
    switch(event.type){
        case 'ADD_VIDEO':
            return translate('addedAVideo');
        case 'UPDATE_VIDEO':
            return translate('updatedAVideo');
        case 'ADD_CODE':
            return translate('addedCodeOnVideo');
        case 'UPDATE_CODE':
            return translate('updateCodeOnVideo');
    }
}