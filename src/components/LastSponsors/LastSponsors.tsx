import "./LastSponsors.less";
import React, { CSSProperties } from 'react';
import { Divider, Button, Spin, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getLastSponsors } from "../../controllers/sponsors";
import ILastSponsors from '../../interfaces/LastSponsor';

interface IProps {
    isMobile?: boolean;
    style?: CSSProperties;
    renderTitle?: React.ReactElement<any>;
    renderButton?: React.ReactElement<any>;
}

interface IState {
    sponsors: ILastSponsors[];
    stateRenderText: 'name' | 'message';
}

export default class LastSponsors extends React.Component<IProps, IState> {

    interval: NodeJS.Timeout;

    constructor(props: IProps) {
        super(props);

        this.state = {
            sponsors: undefined,
            stateRenderText: 'name',
        }
    }

    async componentWillMount() {
        try {
            const sponsors = await getLastSponsors();
            await this.setState({ sponsors });
        } catch{ }

        this.interval = setInterval(() => {
            this.setState({ stateRenderText: this.state.stateRenderText === 'name' ? 'message' : 'name' });
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderPopover = (messages: string[]) => {
        if (messages) {
            return
        }
        return null;
    }

    render() {
        const { isMobile, style, renderButton, renderTitle } = this.props;
        const { sponsors, stateRenderText } = this.state;

        return (
            <div className={`last-sponsors ${isMobile ? 'mobile' : ''}`} style={style}>
                {renderTitle || <Divider className="divider">Last sponsors</Divider>}
                <Spin spinning={!sponsors}>
                    {sponsors && (
                        <ul>
                            {sponsors.map((sponsor, i) => (
                                <li className="card" key={i}>
                                    {sponsor.link && <Icon type="link" className="icon" />}
                                    <span className="amount">{sponsor.amount}€</span>
                                    <p className={`name ${(stateRenderText === 'name' || !sponsor.message) ? 'active' : ''}`}><span>{sponsor.name}</span></p>
                                    {sponsor.message && (
                                        <p className={`message ${stateRenderText === 'message' ? 'active' : ''}`}><span>{sponsor.message}</span></p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </Spin>
                {renderButton || <>{!sponsors && <br />}<Button><Link to="/support">Support us!</Link></Button></>}
            </div>
        )
    }
}