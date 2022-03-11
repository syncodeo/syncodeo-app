import './Tutorial.less';

import React from 'react';
import { Modal, Row, Col, Tabs, } from 'antd';
import translate from '../../localization';
import Anchor from './Anchor';

interface IProps {
    visible: boolean;
    onCancel: () => void;
}

interface IState {

}

export default class Tutorial extends React.Component<IProps, IState>{

    stepsWatch = [{
        id: 'jump-to-code',
        class: 'height',
        img: 'JumpToCode.gif',
        title: 'Jump to code',
    }, {
        id: 'open-github-file',
        class: 'height',
        img: 'OpenGitHubFile.gif',
        title: 'Open GitHub file',
    }, {
        id: 'switch',
        class: 'width',
        img: 'SwitchTimelineGithub.gif',
        title: 'Switch between timeline and GitHub explorer',
    }, {
        id: 'share-video',
        class: 'height',
        img: 'ShareVideoAtTime.gif',
        title: 'Share a video at code time',
    }, {
        id: 'switch-theme',
        class: 'width',
        img: 'SwitchTheme.gif',
        title: 'Switch editor theme',
    }];

    stepsEdit = [{
        id: 'add-code',
        class: 'height',
        img: 'AddCode.gif',
        title: 'Add code',
    }, {
        id: 'edit-code',
        class: 'height',
        img: 'EditCodeAttributes.gif',
        title: 'Update code attributes',
    }, {
        id: 'move-code',
        class: 'height',
        img: 'MoveCodeToTime.gif',
        title: 'Move code to player time',
    }, {
        id: 'delete-code',
        class: 'height',
        img: 'DeleteCode.gif',
        title: 'Delete code',
    }, {
        id: 'link-github-file',
        class: 'width',
        img: 'LinkGithubFileToCode.gif',
        title: 'Link GitHub file',
    }];

    render() {
        const { visible, onCancel, } = this.props;

        return (
            <Modal
                visible={visible}
                onCancel={onCancel}
                width={'90%'}
                title={translate('tutorial')}
                footer={null}
                centered
            >
                <div id="tutorial">
                    <Tabs tabPosition="left">
                        <Tabs.TabPane tab="Watch" key="watch">
                            <Anchor steps={this.stepsWatch} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Edit" key="edit">
                            <Anchor steps={this.stepsEdit} />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </Modal >
        )
    }
}