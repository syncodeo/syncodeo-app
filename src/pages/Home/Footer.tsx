import React from 'react';
import { Row, Col, } from 'antd';
import { Link } from 'react-router-dom';
import translate from '../../localization';
import { connect } from 'react-redux';
import { IStateStore } from '../../interfaces/Store';

interface IProps extends IStateToProps { }

class Footer extends React.Component<IProps, any>{

    render() {
        return (
            <footer id="footer" className="dark">
                <div className="footer-wrap">
                    <Row>
                        <Col lg={6} sm={24} xs={24}>
                            <div className="footer-center">
                                <h2>Syncodéo</h2>
                                {
                                    this.props.isLogged && (
                                        <div>
                                            <Link to={"/user/" + this.props.userConnectedUuid}>{translate('yourChannel')}</Link>
                                        </div>
                                    )
                                }
                                <div>
                                    <Link to="/search">Search for a video</Link>
                                </div>
                                <div>
                                    <Link to="/story">Story</Link>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} sm={24} xs={24}>
                            <div className="footer-center">
                                <h2>Community</h2>
                                <div>
                                    <Link to="/search?feedback">Get in touch</Link>
                                </div>
                                <div>
                                    <a href="https://discuss.syncodeo.io" target="_blank" rel="noopener noreferrer">
                                        Forum
                                    </a>
                                </div>
                                <div>
                                    <a href="https://twitter.com/syncodeo" target="_blank" rel="noopener noreferrer">
                                        Twitter
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} sm={24} xs={24}></Col>
                        <Col lg={6} sm={24} xs={24}>
                            <div className="footer-center" style={{ textAlign: 'right' }}>
                                <h2>Ressources</h2>
                                <div>
                                    UI build with <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> and <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Ant Design</a>.
				                </div>
                                <div>
                                    Syncodéo logo made by <a href="https://amandinebody.fr/" target="_blank" rel="noopener noreferrer">Amandine Body</a>.
				                </div>
                                <div>
                                    Brand logos belong to their brand.
				                </div>
                                <div>
                                    Icons was made by <a href="https://www.flaticon.com/authors/eucalyp" target="_blank" rel="noopener noreferrer">Eucalyp</a>.
				                </div>
                                <div>
                                    Youtube, GitHub and Google Sign-In are not associated to Syncodéo.
				                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="bottom-bar">
                        <Col lg={6} sm={24}>
                            {/* <div className="translate-button">
                                <Button ghost size="small" >
                                    English
                                </Button>
                            </div> */}
                        </Col>
                        <Col lg={18} sm={24}>
                            <span style={{ lineHeight: '16px', paddingRight: 12, marginRight: 11, borderRight: '1px solid rgba(255, 255, 255, 0.55)', }}>
                                <a href="mailto:contact@syncodeo.io">
                                    Contact
				                </a>
                            </span>
                            <span style={{ marginRight: 24 }}>
                                <Link to="/terms" target="_blank" rel="noopener noreferrer">
                                    {translate('terms')}
                                </Link>
                            </span>
                            <span style={{ marginRight: 12 }}>Copyright © 2019 - <a href="https://github.com/GiovanniScarpellino" target="_blank" rel="noopener noreferrer">@GiovanniScarpellino</a> & <a href="https://github.com/ppenelon" target="_blank" rel="noopener noreferrer">@ppenelon</a></span>
                        </Col>
                    </Row>
                </div>
            </footer>
        );
    }
}

interface IStateToProps {
    isLogged: IStateStore['isLogged'];
    userConnectedUuid: IStateStore['userConnectedUuid'];
}

const mapStateToProps = (state) => {
    return {
        isLogged: state.isLogged,
        userConnectedUuid: state.userConnectedUuid,
    }
};

export default connect(mapStateToProps, null)(Footer);
