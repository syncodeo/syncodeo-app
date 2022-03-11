import './NotFound.less';
import React from "react";
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import Particules from 'react-particles-js';
import translate from '../../localization';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ILeftMenuAction, updateLeftMenu } from '../../actions/leftMenu';
import { hideLoading } from 'react-redux-loading-bar';

interface IProps extends IDispatchToProps {

}

interface IState {

}

class NotFound extends React.Component<IProps, IState>{

    particules: any = {
        "particles": {
            "number": {
                "value": 160,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                },
                "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 1,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 4,
                    "size_min": 0.3,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": false,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 0.17,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 600
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false,
                    "mode": "bubble"
                },
                "onclick": {
                    "enable": false,
                    "mode": "repulse"
                },
                "resize": false
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 250,
                    "size": 0,
                    "duration": 2,
                    "opacity": 0,
                    "speed": 3
                },
                "repulse": {
                    "distance": 400,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    }

    componentWillMount() {
        this.props.updateLeftMenu({ justLeftMenu: true });
        this.props.hideLoading();
    }

    render() {
        return (
            <div id="not-found">
                <div className="permission_denied">
                    <Particules params={this.particules} style={{ position: 'absolute', left: 0, zIndex: 0 }}  />
                    <div className="denied__wrapper">
                        <h1>404</h1>
                        <h3 style={{ marginBottom: 0, }}>{translate('noCodeHere')}</h3>

                        <img className="logo" src={require('../../img/logo/logo.png')} width={400} />
                    </div>
                </div>
            </div>
        )
    }
}

interface IDispatchToProps {
    updateLeftMenu: ILeftMenuAction['updateLeftMenu'];
    hideLoading: typeof hideLoading;
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateLeftMenu: bindActionCreators(updateLeftMenu, dispatch),
        hideLoading: bindActionCreators(hideLoading, dispatch),
    }
}

export default connect(null, mapDispatchToProps)(NotFound);