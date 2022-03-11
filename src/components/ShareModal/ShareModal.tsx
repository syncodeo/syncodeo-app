// React
import React from 'react';
import Modal, { ModalProps } from 'antd/lib/modal';
import { Button } from 'antd';
import { copyToClipboard } from '../../helpers/functions';
import Video from '../../interfaces/Video';
import Social from './Socials';


interface IProps extends ModalProps {
    video: Video;
}

interface IState { }

class ShareModal extends React.Component<IProps, IState>{

    render() {
        const { video } = this.props;
        
        if (!video) {
            return <></>;
        }

        let title = video.title;
        const urlToShare = 'https://syncodeo.io/watch?v=' + video.videoId;

        return (
            <Modal
                {...this.props}
                centered
                title="Share the video!"
                width="275"
                footer={[
                    <Button key="1" type="dashed" onClick={() => copyToClipboard(urlToShare)}>Copy video link to clipboard</Button>,
                    <Button key="2" onClick={this.props.onCancel}>Close</Button>
                ]}
            >
                    <Social title={title} shareUrl={urlToShare} />
            </Modal>
        )
    }
}

export default ShareModal;