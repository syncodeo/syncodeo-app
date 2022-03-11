import React from 'react';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { List } from 'antd';

const { TweenOneGroup } = TweenOne;

const pointPos = [
    { x: -30, y: -10 },
    { x: 20, y: -20 },
    { x: -65, y: 15 },
    { x: -45, y: 80 },
    { x: 35, y: 5 },
    { x: 50, y: 50, opacity: 0.2 },
];

interface IFeature {
    title: string;
    content: string;
    src: string;
    color: string;
    shadowColor: string;
}

interface IProps {
    isMobile: boolean;
}

interface IState {
    hoverNum: number;
    featuresCN: IFeature[];
}

class WhySyncodeo extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            hoverNum: null,
            featuresCN: [
                {
                    title: 'YouTube videos',
                    content: 'Don\'t upload anything.\nPick your videos from YouTube.',
                    src: require('../../img/home/youtube.png'),
                    color: '#FF0000',
                    shadowColor: 'rgba(255, 0, 0, .12)',
                },
                {
                    title: 'GitHub repositories',
                    content: 'Choose to upload your code directly from GitHub.',
                    src: require('../../img/home/github.png'),
                    color: '#333333',
                    shadowColor: 'rgba(51, 51, 51, .12)',
                },
                {
                    title: 'Google Sign-In',
                    content: 'Use your Google account to publish content.\nNo need to login to watch.',
                    src: require('../../img/home/google.png'),
                    color: '#4285f4',
                    shadowColor: 'rgba(66, 133, 244, .12)',
                },
                {
                    title: 'Monaco Editor',
                    content: 'Code displayed on VSCode editor.\nFast edit and ressourceful!',
                    src: require('../../img/home/vscode.svg'),
                    color: '#0077C8',
                    shadowColor: 'rgba(0, 119, 200, .12)',
                },
                {
                    title: 'Free to use',
                    content: 'No ad, no premium.\nFor everyone and forever!',
                    src: require('../../img/home/knowledge.png'),
                    color: '#66CFEC',
                    shadowColor: 'rgba(102, 207, 236, .12)',
                },
                {
                    title: 'Our community makes our growth',
                    content: 'Thought by users for users.\nYour feedback is our fuel!',
                    src: require('../../img/home/world.png'),
                    color: '#EF7385',
                    shadowColor: 'rgba(239, 115, 133, .12)',
                },
                {
                    title: 'Collaborative',
                    content: 'You\'re part of a team?\nAllow your mates to contribute on your behalf and work on videos together!',
                    src: require('../../img/home/group.png'),
                    color: '#F77E6B',
                    shadowColor: 'rgba(247, 126, 107, .12)',
                },
                {
                    title: 'Search engine',
                    content: 'Internal search engine.\nAdd visibility to your content!',
                    src: require('../../img/home/search.png'),
                    color: '#CF9E76',
                    shadowColor: 'rgba(207, 158, 118, .12)',
                },
                {
                    title: 'Ready to share, ready to use',
                    content: 'Edit your video and share the URL.',
                    src: require('../../img/home/internet.png'),
                    color: '#313751',
                    shadowColor: 'rgba(49, 55, 81, .12)',
                }
            ]
        };
    }

    onMouseOver = (i) => this.setState({ hoverNum: i, });

    onMouseOut = () => this.setState({ hoverNum: null });

    getEnter = (e) => {
        const i = e.index;
        const r = (Math.random() * 2) - 1;
        const y = (Math.random() * 10) + 5;
        const delay = Math.round(Math.random() * (i * 50));
        return [
            {
                delay, opacity: 0.4, ...pointPos[e.index], ease: 'easeOutBack', duration: 300,
            },
            {
                y: r > 0 ? `+=${y}` : `-=${y}`,
                duration: (Math.random() * 1000) + 2000,
                yoyo: true,
                repeat: -1,
            }];
    }

    renderFeature = (item: IFeature, hoverNum: number, i: number) => {
        const isHover = hoverNum === i;
        const pointChild = [
            'point-0 left', 'point-0 right',
            'point-ring', 'point-1', 'point-2', 'point-3',
        ].map(className => (
            <TweenOne
                component="i"
                className={className}
                key={className}
                style={{
                    background: item.color,
                    borderColor: item.color,
                }}
            />
        ));

        return (
            <div key={i.toString()}>
                <div
                    className="why-syncodeo-box"
                    onMouseEnter={() => { this.onMouseOver(i); }}
                    onMouseLeave={this.onMouseOut}
                >
                    <TweenOneGroup
                        className="why-syncodeo-point-wrapper"
                        enter={this.getEnter}
                        leave={{
                            x: 0, y: 30, opacity: 0, duration: 300, ease: 'easeInBack',
                        }}
                    >
                        {(this.props.isMobile || isHover) && pointChild}
                    </TweenOneGroup>
                    <div
                        className="why-syncodeo-image"
                        style={{
                            boxShadow: `${isHover ? '0 12px 24px' :
                                '0 6px 12px'} ${item.shadowColor}`,
                        }}
                    >
                        <img src={item.src} alt="img" style={{ width: 32 }} />
                    </div>
                    <h3><b>{item.title}</b></h3>
                    <p>
                        {item.content.split('\n').map((line, i, arr) => {
                            if (i < arr.length - 1) return <span key={i}>{line}<br /></span>
                            return <span key={i}>{line}</span>
                        })}
                    </p>
                </div>
            </div>
        )
    }

    render() {

        return (
            <div className={`home-page why-syncodeo ${this.props.isMobile && "mobile"}`} >
                <div className="home-page-wrapper" id="why-syncodeo-wrapper">
                    <h2>Syncodéo in <span>9 features</span>!</h2>
                    <List
                        grid={{ column: this.props.isMobile ? 2 : 3 }}
                        dataSource={this.state.featuresCN}
                        key="list"
                        className="why-syncodeo-grid"
                        renderItem={(item: IFeature, i: number) => {
                            const { featuresCN, hoverNum } = this.state;
                            return (
                                <OverPack key={i.toString()}>
                                    <List.Item key={i.toString()} style={{ textAlign: 'center' }}>
                                        <QueueAnim
                                            className="why-syncodeo-box-wrapper"
                                            key={i.toString()}
                                            type="bottom"
                                            leaveReverse
                                            delay={[i * 100, (featuresCN.length - 1 - i) * 100]}
                                            component="div"
                                        >
                                            {this.renderFeature(item, hoverNum, i)}
                                        </QueueAnim>
                                    </List.Item>
                                </OverPack>
                            )
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default WhySyncodeo;
