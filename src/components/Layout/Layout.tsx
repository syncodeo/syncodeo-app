import './Layout.less';

import React, { Suspense } from 'react';
import { Layout as L, } from 'antd';

// Components
import Header from '../Header/Header';
import LeftMenu from '../LeftMenu/LeftMenu';
import { History } from 'history';
import { connect } from 'react-redux';
import { IStateStore } from '../../interfaces/Store';
import NotFound from '../../pages/NotFound/NotFound';
import { IShow404Action, resetShow404 } from '../../actions/show404';
import { bindActionCreators } from 'redux';
import Loading from '../Loading/Loading';

interface IProps extends IStateToProps, IDispatchToProps {
    history: History<any>;
}

interface IState { }

class Layout extends React.Component<IProps, IState> {

    render() {
        const { Content } = L;
        const { children, show404, history } = this.props;
        const { selectedKeys, isWatchPage, openFeedback, justLeftMenu, title, icon, backIcon, removeLeftMenu, haveGithubLink } = this.props.leftMenu;

        return (
            <>
                <L id="layout" style={{ height: '100vh', display: removeLeftMenu ? 'none' : null }}>

                    <LeftMenu selectedKeys={selectedKeys} isWatchPage={isWatchPage} feedback={openFeedback} haveGithubLink={haveGithubLink} />

                    <L>
                        {!justLeftMenu && <Header style={{ whiteSpace: 'nowrap' }} title={title} icon={(backIcon && history.length > 2) ? 'left' : icon} onClickIcon={(backIcon && history.length > 2) ? history.goBack : null} />}

                        <Content className={justLeftMenu ? '' : 'content'} style={{ background: 'white' }}>
                            <Suspense fallback={<Loading />}>
                                {(show404 || !children) ? <NotFound /> : children}
                            </Suspense>
                        </Content>
                    </L>
                </L >
                <Suspense fallback={<Loading />}>
                    {removeLeftMenu && ((show404 || !children) ? <NotFound /> : children)}
                </Suspense>
            </>
        )
    }
}

interface IStateToProps {
    leftMenu: IStateStore['leftMenu'];
    show404: IStateStore['show404'];
    loading: IStateStore['loading'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        leftMenu: state.leftMenu,
        show404: state.show404,
        loading: state.loading,
    };
};

interface IDispatchToProps {
    resetShow404: IShow404Action['resetShow404'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        resetShow404: bindActionCreators(resetShow404, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);