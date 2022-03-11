import './Sponsors.less';
import React from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, List, Card, Row, Col, Icon, Spin, Drawer, Divider } from 'antd';
import { ILeftMenuAction, updateLeftMenu } from '../../actions/leftMenu';
import { hideLoading } from 'react-redux-loading-bar';
import SponsorsModal from '../../components/SponsorsModal/SponsorsModal';
import LastSponsors from '../../components/LastSponsors/LastSponsors';
import Sponsor from '../../interfaces/Sponsor';
import { getAllSponsors } from '../../controllers/sponsors';
import { IStateStore } from '../../interfaces/Store';

interface IProps extends IDispatchToProps, IStateToProps { }

interface IState {
    modalVisible: boolean;
    sponsors: Sponsor[];
    actualSponsor: Sponsor;
    showSponsorDrawer: boolean;
}

class Sponsors extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props);

        props.updateLeftMenu({ title: "Support us 😃", icon: 'smile' });
        props.hideLoading();

        this.state = {
            modalVisible: false,
            sponsors: undefined,
            actualSponsor: undefined,
            showSponsorDrawer: false,
        }
    }

    async componentWillMount() {
        try {
            const sponsors = await getAllSponsors();
            this.setState({ sponsors });
        } catch{ }
    }

    render() {
        const { modalVisible, sponsors, actualSponsor, showSponsorDrawer: showSponsorModal } = this.state;
        const { isMobile } = this.props;

        return (
            <div id="sponsors">
                <LastSponsors
                    style={{ position: 'relative', top: 2 }}
                    renderButton={<></>}
                    renderTitle={<h2 style={{ textAlign: 'left' }}>Last sponsors</h2>}
                />
                <SponsorsModal visible={modalVisible} onCancel={() => this.setState({ modalVisible: false })} />
                <h2 style={{ marginTop: 10 }}>Why donate ?</h2>
                <Row style={{ marginBottom: 55 }}>
                    <Col className="why-donate-card" lg={8} xs={24}>
                        <img src={require('../../img/sponsors/growth.svg')} alt="Syncodeo logo" />
                        <p>Syncodéo stays <b>free</b></p>
                        <ul>
                            <li>- Syncodéo is a adless and premiumless for a reason;</li>
                            <li>- Take part of knwoledge opening.</li>
                        </ul>
                    </Col>
                    <Col className="why-donate-card" lg={8} xs={24}>
                        <img src={require('../../img/sponsors/income.svg')} alt="Syncodeo logo" />
                        <p>Give <b>power</b> to Syncodéo</p>
                        <ul>
                            <li>- Money allows expansion.</li>
                        </ul>
                    </Col>
                    <Col className="why-donate-card" lg={8} xs={24}>
                        <img src={require('../../img/sponsors/savings.svg')} alt="Syncodeo logo" />
                        <p><b>Taxe deductible</b> donations</p>
                        <ul>
                            <li>- As a nonprofit organization...</li>
                        </ul>
                    </Col>
                </Row>
                <p style={{ marginBottom: 30 }}>
                    Syncodéo is a free to use platform and will always be! <br />
                    If you share our values and want to take part of the journey please consider supporting Syncodéo by macking a donation.
                </p>
                <div style={{ width: '100%', textAlign: 'center', marginBottom: 15 }}>
                    <Button type="primary" onClick={() => this.setState({ modalVisible: true })}>SUPPORT SYNCODEO NOW!</Button>
                </div>
                <h2>All sponsors</h2>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, lg: 4 }}
                    itemLayout="horizontal"
                    loading={!sponsors}
                    dataSource={sponsors}
                    renderItem={(sponsor: Sponsor) => {
                        const amount = sponsor.amounts.reduce((previous, current) => previous + current);

                        return (
                            <List.Item className="sponsor" onClick={() => this.setState({ showSponsorDrawer: true, actualSponsor: sponsor })}>
                                <Card
                                    hoverable
                                    bordered
                                    style={{ height: '100%' }}
                                >
                                    <h4>{sponsor.name} {amount && <span>- <b>{amount}€</b></span>}</h4>
                                    {sponsor.messages && (
                                        <p>{sponsor.messages[sponsor.messages.length - 1]}</p>
                                    )}
                                </Card>
                            </List.Item>
                        )
                    }}
                />

                <Drawer
                    closable
                    onClose={() => this.setState({ showSponsorDrawer: false, })}
                    placement='left'
                    className="sponsor-drawer"
                    visible={showSponsorModal}
                    width={isMobile ? '100%' : '600'}
                    bodyStyle={{ paddingTop: 0 }}
                    title={actualSponsor && <h3 className="title">{actualSponsor.name}</h3>}
                >
                    <Spin spinning={!actualSponsor}>
                        {actualSponsor && (
                            <>
                                <Divider>Last donations</Divider>
                                <List
                                    itemLayout="vertical"
                                    size="small"
                                    bordered
                                    loading={!actualSponsor}
                                    header={<span>All donations: <b>{actualSponsor.amounts.reduce((previous, current) => previous + current) + "€"}</b></span>}
                                    dataSource={actualSponsor.amounts}
                                    renderItem={(amount, index) => (
                                        <List.Item>
                                            <b>{amount}€</b> <br />
                                            {actualSponsor.links && actualSponsor.links[index] && <><a target="_blank" href={actualSponsor.links[index]}>{actualSponsor.links[index]}</a><br /></>}
                                            {actualSponsor.messages && actualSponsor.messages[index] && <p>{actualSponsor.messages[index]}</p>}
                                        </List.Item>
                                    )}
                                />
                            </>
                        )}
                    </Spin>
                </Drawer>
            </div>
        )
    }
}

interface IStateToProps {
    isMobile: IStateStore['isMobile']
}

const mapStateToProps = (state: IStateToProps) => ({
    isMobile: state.isMobile,
} as IStateToProps)

interface IDispatchToProps {
    updateLeftMenu: ILeftMenuAction['updateLeftMenu'];
    hideLoading: typeof hideLoading;
}

const mapDispatchToProps = (dispatch: any) => ({
    updateLeftMenu: bindActionCreators(updateLeftMenu, dispatch),
    hideLoading: bindActionCreators(hideLoading, dispatch),
} as IDispatchToProps)

export default connect(mapStateToProps, mapDispatchToProps)(Sponsors);