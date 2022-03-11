import './VideoInfo.less';

import React from 'react';
import Video from '../../../interfaces/Video';
import { Spin, Divider, Icon } from 'antd';
import { REGEX_URL, REGEX_MINUTE } from '../../../constants/regex';
import reactStringReplace from 'react-string-replace';
import YouTubeController from '../../../controllers/youtube';
import translate from '../../../localization';
import { User } from '../../../interfaces/User';
import { getUserInfo } from '../../../controllers/user';
import { connect } from 'react-redux';
import { IStateStore } from '../../../interfaces/Store';
import UserNameAvatar from '../../User/UserNameAvatar/UserNameAvatar';
import FormEditAddVideo from '../../Dashboard/FormEditAddVideo/FormEditAddVideo';

interface IProps extends IStateToProps {
    github: string;
    video: Video;
}

interface IState {
    user: User;
    video: Video;
    description: JSX.Element | JSX.Element[];
    getUserInfoLoading: boolean;
    showModalEditVideo: boolean;
}

class VideoInfo extends React.Component<IProps, IState>{


    constructor(props: IProps) {
        super(props);

        this.state = {
            user: undefined,
            video: undefined,
            description: undefined,
            getUserInfoLoading: true,
            showModalEditVideo: false,
        }
    }

    async componentWillMount() {
        const { video } = this.props;
        try {
            const { data: user } = await getUserInfo(this.props.userUuid);

            let description = this.removeEmptySpaces(video.description);

            this.setState({
                user,
                video,
                getUserInfoLoading: false,
                description: this.convertDescription(description),
            });
        } catch{ }
    }

    removeEmptySpaces = (description: string) => {
        if (description) {
            return description.replace(/(?:\r\n|\r|\n)/g, ' \n') + ' ';
        }
        return null;
    }

    convertDescription = (description: string) => {
        return description ? description.split('\n').map((item, i) => {
            let remplacedItem = reactStringReplace(item, REGEX_URL, (match, i) => {
                console.log(match);
                return (
                    <a key={i} href={match} rel="noopener noreferrer" target="_blank">{match}</a>
                )
            });
            remplacedItem = reactStringReplace(remplacedItem, REGEX_MINUTE, (match, i) => {
                const split = match.split(':');
                const seconds = parseInt(split[0]) * 60 + parseInt(split[1]);
                return <a key={i} onClick={() => YouTubeController.seekTo(seconds)}>{match}</a>
            });
            return <p key={i}>{remplacedItem}</p>;
        })
            : <p>{translate('noDescription')}</p>
    }

    render() {
        const { video, user, getUserInfoLoading } = this.state;

        return (
            <div id="video-info">
                {this.props.itsMyVideo && (
                    <FormEditAddVideo
                        type="edit"
                        video={video}
                        onUpdated={video => {
                            let description = this.removeEmptySpaces(video.description);

                            this.setState({ 
                                video,
                                description: this.convertDescription(description),
                            });
                        }}
                        modalProps={{
                            visible: this.state.showModalEditVideo,
                            onCancel: () => this.setState({ showModalEditVideo: false }),
                            centered: true,
                            width: '90%',
                            title: translate('updateVideo')
                        }}
                    />
                )}
                <Spin spinning={!video || !user || this.props.loading !== 0}>
                    {user && (
                        <>
                            <UserNameAvatar user={user} getUserInfoLoading={getUserInfoLoading} bigAvatar style={{ position: 'relative' }} />
                            {this.props.itsMyVideo && (
                                <Icon
                                    type="edit"
                                    style={{ position: 'absolute', top: 0, right: 15, fontSize: 20, cursor: 'pointer' }}
                                    onClick={() => this.setState({ showModalEditVideo: true })}
                                />
                            )}
                            <Divider />
                        </>
                    )}
                    {video && (
                        <>
                            <h2>{video.title}</h2>
                            {this.state.description}
                        </>
                    )}
                </Spin>
            </div>
        )
    }
}

interface IStateToProps {
    loading: IStateStore['loading'];
    userUuid: IStateStore['userUuid'];
    itsMyVideo: IStateStore['itsMyVideo'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        loading: state.loading,
        userUuid: state.userUuid,
        itsMyVideo: state.itsMyVideo,
    }
};

export default connect(mapStateToProps, null)(VideoInfo);