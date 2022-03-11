import React from 'react';
import { Row, Col, Anchor as AnchorAntd, Button } from "antd";

interface IProps {
    steps: any;
}

interface IState {
    index: number;
    title: string;
}

export default class Anchor extends React.Component<IProps, IState>{
    inited: boolean = false;
    ref: AnchorAntd;

    constructor(props: IProps) {
        super(props);

        this.state = {
            index: 0,
            title: props.steps[0].title,
        }
    }

    handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, link: { title: React.ReactNode, href: string, }) => {
        e.preventDefault();
        let element = document.getElementById(link.href);

        let links: [] = (this.ref as any).links;

        this.setState({
            index: links.indexOf(link.href as never),
            title: link.title.toString(),
        });

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    next = () => {
        this.setState({
            index: this.state.index + 1,
            title: this.props.steps[this.state.index + 1].title,
        }, () => {
            const id = this.props.steps[this.state.index].id;
            const element = document.getElementById(id);
            this.ref.setState({ activeLink: id });
            element.scrollIntoView({ behavior: 'smooth' });
        });
    }

    previous = () => {
        this.setState({
            index: this.state.index - 1,
            title: this.props.steps[this.state.index - 1].title,
        }, () => {
            const id = this.props.steps[this.state.index].id;
            const element = document.getElementById(id);
            this.ref.setState({ activeLink: id });
            element.scrollIntoView({ behavior: 'smooth' });
        });
    }

    render() {
        const { steps } = this.props;

        return (
            <Row gutter={16}>
                <Col span={18} id="content">
                    {steps.map((item, index) => (
                        <div id={item.id} key={index}>
                            <img className={item.class} src={require('../../img/tutorial/' + item.img)} />
                        </div>
                    ))}
                </Col>
                <Col span={6} className="anchor">
                    <AnchorAntd onClick={this.handleClick} ref={ref => {
                        if (!this.inited) {
                            ref.setState({ activeLink: steps[0].id });
                            this.ref = ref;
                        }
                        this.inited = true;
                    }}>
                        {steps.map((item, index) => (
                            <AnchorAntd.Link key={index} href={item.id} title={item.title} />
                        ))}
                    </AnchorAntd>

                    <div className="actions">
                        <h2 className="title">{this.state.title}</h2>

                        <Button icon="left" size="large" className="left" type="primary" onClick={this.previous} disabled={this.state.index === 0} />
                        <Button icon="right" size="large" className="right" type="primary" onClick={this.next} disabled={this.state.index === steps.length - 1} />
                    </div>
                </Col>
            </Row>
        )
    }
}