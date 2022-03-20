import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateLeftMenu, ILeftMenuAction } from '../../actions/leftMenu';
import { hideLoading } from 'react-redux-loading-bar';

interface IProps extends IDispatchToProps { }

interface IState { }

class Terms extends React.Component<IProps, IState> {

    constructor(props: IProps){
        super(props);

        props.updateLeftMenu({
            title: 'Terms',
            icon: 'book',
            selectedKeys: ['terms'],
        });

        props.hideLoading();
    }

    render() {
        return (
            <div style={{ backgroundColor: 'white', padding: 15 }}>
                    <br /><br />
                Publication directors : Pierre PENELON and Giovanni SCARPELLINO
                    <br /><br />
                Hosting provider : <a href="https://www.ovh.fr/" rel="noopener noreferrer" target="_blank">OVH</a>
                <br /><br />
                Customer service :<br /><br />
                You can reach us by email at <a href="mailto:scarren.pro@gmail.com">scarren.pro@gmail.com</a>.
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


export default connect(null, mapDispatchToProps)(Terms);