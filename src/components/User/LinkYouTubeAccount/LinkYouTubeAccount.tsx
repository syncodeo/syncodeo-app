import React from 'react';
import { Alert } from 'antd';
import translate from '../../../localization';
import { linkYoutubeAccount } from '../../../controllers/accounts';

interface IProps {
    onYouTubeAccountLinked: () => void;
}

export default class LinkYouTubeAccount extends React.Component<IProps, any> {

    render() {
        return (
            <Alert
                message={translate('linkYoutubeAccount')}
                description={
                    <>
                        <span>{translate('needLinkYoutubeAccountLinkVideo')}</span>
                        <br />
                        <a onClick={async () => {
                            try {
                                await linkYoutubeAccount();
                                this.props.onYouTubeAccountLinked();
                            } catch{ }
                        }}>
                            {translate('clickToLinkYoutubeAccount')}
                        </a>
                    </>
                }
                type="error"
                style={{ marginBottom: 15 }}
            />
        )
    }
}