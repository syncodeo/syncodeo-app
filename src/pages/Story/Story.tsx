import './Story.less';

import React from 'react';
import { ILeftMenuAction, updateLeftMenu } from '../../actions/leftMenu';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hideLoading } from 'react-redux-loading-bar';

class Story extends React.Component<IDispatchToProps, any>{

    constructor(props: IDispatchToProps) {
        super(props);

        props.updateLeftMenu({
            title: 'Story',
            icon: 'book',
            selectedKeys: ['story'],
        });

        props.hideLoading();
    }

    render() {
        return (
            <div id="learn-more">
                <p>
                    You wanna know more about Syncodeo?<br />
                    You wanna know why we thought this platform?<br />
                    Well that’s simple… it is mainly because… we’ve been in your shoes!
                    </p>

                <p>
                    You do know that feeling when you want to learn anything about I.T. and you find tons of video
                    tutorials and then less in your mother-tongue, lesser truly meant for your current level of
                    experimentation and finally even lesser because it was not the I.T. language you were looking for.
                    </p>

                <p>
                    And when you get over the frustration and the time loss… you have yet to lose more time switching
                    between the video tutorials and your editor, trying to pause the video at the exact second you need
                        to see the damn code line you can’t even properly read because it was captured in low resolution.
                    </p>

                <p>And you wish you could go back to learning by books but those are already deprecated and you know better than this!</p>

                <p>Been there, done that.</p>

                <p>This is why IT HAD TO CHANGE!<br />
                    And there was only one way to make the right change, one right move.</p>

                <p>
                    One place to post them all,
                    One place to find them,
                    One place to synchronize videos and code lines together and in the web bind them.
                    In land of Syncodeo where the contributors lie…
                    </p>

                <p>
                    Less epic way to say this: this is why we designed Syncodeo, which actually stands for
                        synchronized code & video.
                    </p>

                <p>
                    We wanted to make it possible for anyone to access a video listing, be able to search for the perfect
                    content (considering the level of expertise, some keywords and interests), find what they were
                    looking for and be able to learn from it in a really efficient way.
                    </p>
                <p>
                    This meant we didn’t want you to be forced to pause the video but more likely to display the code
                    lines you are looking for on the same screen.
                    </p>
                <p>
                    And we also wanted you to be able to benefit from specific helpful features such as syntax
                    recognition and colorization.
                    </p>
                <p>
                    On the other hand, we also need you to be able to contribute in your own way.
                    This is why we allow you to log in through your Google account and bind you Youtube account.
                    </p>
                <p>
                    From there, you can index you content, synchronize your code and release some tutorials for other
                    users.
                    </p>
                <p>
                    And because we’ve hoped for that kind of solution for so long, we’ve decided to let you access this
                    for the unexpected yet real price of $0!
                    </p>
                <p>
                    Because learning already has a cost, your time, which is already more than anyone has to offer.
                    </p>
                <p>
                    And because we thought this platform as I.T. students who hoped so much for something similar to
                    help us through both our studies and our own challenges!
                    </p>
                <p>
                    Of course, if you really want to support us more than by indexing videos, spreading the word
                    around and sending us corgi pictures to show us how much you like us, you can.
                    </p>
                <p>
                    Either by making a donation or becoming a sponsor.
                    </p>
                <p>
                    Why would I make a donation?
                    </p>
                <p>
                    Whether you are an individual or a company, making a donation will allow you to benefit from
                    taxes reduction (depending on the fiscal rules of your country).
                    </p>
                <p>
                    You can donate up to €6’750 a year and benefit from those advantages in addition of helping us
                    maintain and improve our system.
                    </p>
                <p>
                    You want to invest more money?<br />
                    You can be one of our sponsors.
                    </p>
                <p>
                    Sponsors won’t have any substantial / executive / managerial role.<br />
                    This is only an opportunity to us spread a new way of learning and to say you helped us grow.<br />
                    You will appear on our “our sponsors” page and that’s merely it.
                    </p>
                <p>
                    Of course, from time to time we could also talk about you if the occasion presents itself but there is
                    no promise nor any contractual obligation here.
                    </p>
                <p>
                    You need more data to make up your mind?<br />
                    This is what we can tell you about Syncodeo right now!
                    </p>
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


export default connect(null, mapDispatchToProps)(Story);