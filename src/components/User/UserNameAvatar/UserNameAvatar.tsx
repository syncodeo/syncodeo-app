import './UserNameAvatar.less';

import React from 'react';
import YouTubeSubscribeButton from '../YouTubeSubscribeButton/YouTubeSubscribeButton';
import { Skeleton, Avatar, Button } from 'antd';
import { User } from '../../../interfaces/User';
import { Link } from 'react-router-dom';
import translate from '../../../localization';
import { linkYoutubeAccount } from '../../../controllers/accounts';

interface IProps {
    user: User;
    getUserInfoLoading: boolean;
    bigAvatar?: boolean;
    youtubeAccountShareButton?: boolean;
    style?: React.CSSProperties;
    youtubeAccountLinked?: boolean;
    setAccoutLinked?: (channelId: string) => void;
    userSpan?: boolean;
}

interface IState {
    loading: boolean;
}

export default class UserNameAvatar extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            loading: false,
        }
    }

    render() {
        const { user, bigAvatar, getUserInfoLoading, style, youtubeAccountShareButton, youtubeAccountLinked, userSpan } = this.props;
        const { loading } = this.state;
        let avatarStyle: React.CSSProperties = { marginRight: 15, }
        if (bigAvatar) avatarStyle = { ...avatarStyle, height: 80, width: 80, }

        return (
            <div id="username-avatar" style={style}>
                {youtubeAccountShareButton && (
                    <div
                        style={{ position: 'absolute', right: 35, top: 35 }}
                        children={youtubeAccountLinked ? <YouTubeSubscribeButton channelId={user.channelId} /> : (
                            <Button icon="link" type="primary" loading={loading} onClick={async () => {
                                this.setState({ loading: true });
                                try {
                                    const { data: response } = await linkYoutubeAccount();
                                    this.props.setAccoutLinked(response.channelId);
                                } catch{ }
                                this.setState({ loading: false });
                            }}>{translate('linkYoutubeAccount')}</Button>
                        )}
                    />
                )}
                <Skeleton loading={getUserInfoLoading} active avatar={{ size: 'large' }} title={{ width: 300 }} paragraph={{ rows: 0 }}>
                    <Link to={"/user/" + user.uuid}>
                        <Avatar src={user.picture} style={avatarStyle} />
                        {userSpan ? <span className="title">{user.name}</span> : <h1 className="title title-absolute">{user.name}</h1>}
                    </Link>
                </Skeleton>
            </div>
        )
    }
}