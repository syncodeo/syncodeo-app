import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.less';

const { detect } = require('detect-browser');
const browser = detect();
if (!localStorage.getItem('device')) {
    let name = browser && browser.name ? (browser.name as string).substr(0, 10) + '-' : 'unknow-';
    let os = browser && browser.os ? (browser.os as string).substr(0, 10) + '-' : 'unknow-';
    let device = name + os + require('shortid').generate();
    localStorage.setItem('device', device.split(' ').join(''));
}

// Google Analytics
import ReactGA from 'react-ga';
if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(TRACKING_CODE);
    ReactGA.pageview(window.location.pathname + window.location.search);
}

// Sentry
import * as Sentry from '@sentry/browser';
if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: SENTRY_DSN });
}

// React & Redux
import { createBrowserHistory, UnregisterCallback } from "history";
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { enquireScreen } from 'enquire-js';

// Reducers
import codesReducer from './reducers/codes';
import activeCodeIndexReducer from './reducers/activeCodeIndex';
import loadingReducer from './reducers/loading';
import itsMyVideoReducer from './reducers/itsMyVideo';
import menuCollapsedReducer from './reducers/menuCollapsed';
import isLoggedReducer from './reducers/isLogged';
import actualLayoutReducer from './reducers/actualLayout';
import actualMonacoModelReducer from './reducers/actualMonacoModel';
import activeEditCodeIndexReducer from './reducers/activeEditCodeIndex';
import previousLanguageReducer from './reducers/previousLanguage';
import actualPlaylistReducer from './reducers/actualPlaylist';
import userUuidReducer from './reducers/userUuid';
import gridListReducer from './reducers/gridList';
import userConnectedUuidReducer from './reducers/userConnectedUuid';
import leftMenuReducer from './reducers/leftMenu';
import show404Reducer from './reducers/show404';
import isMobileReducer from './reducers/isMobile';

// Components
import Layout from './components/Layout/Layout';
import { notification, Button, Spin, Icon } from 'antd';
import LoadingBar, { loadingBarReducer, showLoading, resetLoading } from 'react-redux-loading-bar';

import { TRACKING_CODE, SENTRY_DSN } from './constants/env';
import { PRIMARY_COLOR } from './helpers/colors';
import { getUuidFromToken } from './controllers/token';
import { UPDATE_USER_CONNECTED_UUID, UPDATE_SHOW_404, UPDATE_IS_MOBILE } from './constants/store';
import Loading from './components/Loading/Loading';

let store = createStore(combineReducers({
    codes: codesReducer,
    activeCodeIndex: activeCodeIndexReducer,
    loading: loadingReducer,
    itsMyVideo: itsMyVideoReducer,
    menuCollapsed: menuCollapsedReducer,
    isLogged: isLoggedReducer,
    actualLayout: actualLayoutReducer,
    actualMonacoModel: actualMonacoModelReducer,
    activeEditCodeIndex: activeEditCodeIndexReducer,
    previousLanguage: previousLanguageReducer,
    actualPlaylist: actualPlaylistReducer,
    userUuid: userUuidReducer,
    userConnectedUuid: userConnectedUuidReducer,
    gridList: gridListReducer,
    loadingBar: loadingBarReducer,
    leftMenu: leftMenuReducer,
    show404: show404Reducer,
    isMobile: isMobileReducer,
}), applyMiddleware(thunk));

interface IProps {

}

interface IState { }

class App extends React.Component<IProps, IState> {

    unregisterHistoryListen: UnregisterCallback;
    history = createBrowserHistory();

    componentWillMount() {
        // Put user uuid in store when first load page
        if (localStorage.getItem('accessToken')) {
            store.dispatch({
                type: UPDATE_USER_CONNECTED_UUID,
                userUuid: getUuidFromToken(),
            });
        }

        enquireScreen((isMobile) => {
            store.dispatch({
                type: UPDATE_IS_MOBILE,
                isMobile: !!isMobile,
            })
        });

        this.unregisterHistoryListen = this.history.listen((location, action) => {
            document.title = "Syncodéo";
            store.dispatch(resetLoading());
            if (store.getState().show404) {
                store.dispatch({ type: UPDATE_SHOW_404, show404: false, });
            }
            if (process.env.NODE_ENV === 'production') {
                let page = location.pathname + location.search;
                ReactGA.set({ page, });
                ReactGA.pageview(page);
            }
            if (!location.hash) {
                store.dispatch(showLoading());
            }
        });

        if (localStorage.getItem('cookieConsent') !== 'true') {
            notification.open({
                message: (
                    <span>
                        This website uses cookies to ensure you get the best experience on our website.<br />
                        <a href="https://cookiesandyou.com/" target="_blank" rel="noopener noreferrer">
                            Learn more
                        </a>
                    </span>
                ),
                type: 'info',
                btn: <Button onClick={() => {
                    localStorage.setItem('cookieConsent', 'true');
                    notification.close('cookieConsent');
                }}>Got it!</Button>,
                duration: null,
                placement: 'bottomRight',
                key: 'cookieConsent'
            });
        }

        Spin.setDefaultIndicator(<Icon type="loading" />);
    }

    componentWillUnmount() {
        this.unregisterHistoryListen();
    }

    render() {
        const Home = React.lazy(() => import('./pages/Home'));
        const Watch = React.lazy(() => import('./pages/Watch/Watch'));
        const Terms = React.lazy(() => import('./pages/Terms/Terms'));
        const Search = React.lazy(() => import('./pages/Search/Search'));
        const User = React.lazy(() => import('./pages/User/User'));
        const EditPlaylists = React.lazy(() => import('./pages/EditPlaylists/EditPlaylists'));
        const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'));
        // TODO: Add for sponsors
        // const Sponsors = React.lazy(() => import('./pages/Sponsors/Sponsors'));

        return (
            <Suspense fallback={<Loading />}>
                <Router history={this.history}>
                    <Provider store={store}>
                        <LoadingBar style={{ zIndex: 999, background: PRIMARY_COLOR, }} />
                        <Switch>
                            <Route path="/" render={(props) => <Home route={props} />} exact />

                            <Layout history={this.history}>
                                <Switch>
                                    <Route path="/watch" render={(props) => <Watch route={props} />} exact />
                                    <Route path="/terms" render={props => <Terms />} exact />
                                    <Route path="/search" render={props => <Search route={props} />} exact />
                                    {/* TODO: Add for sponsors */}
                                    {/* <Route path="/support" render={props => <Sponsors />} exact /> */}
                                    <Route path="/user/:id/:tab?" render={props => <User route={props} />} exact />
                                    <Route path="/playlists/:id" render={props => <EditPlaylists route={props} />} exact />
                                    <Route render={() => <NotFound />} />
                                </Switch>
                            </Layout>
                        </Switch>
                    </Provider>
                </Router>
            </Suspense>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));