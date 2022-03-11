import './MonacoEditor.less';

// React & Redux
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import hljs from 'highlight.js';
import _md from 'markdown-it';

// Actions
import { incrementLoading, decrementLoading, ILoadingAction, } from '../../../actions/loading';
import { updateCode, ICodesAction, } from '../../../actions/codes';

// Components
import * as monaco from 'monaco-editor';

// Controllers
import MonacoEditorController from '../../../controllers/monacoEditor';
import YouTubeController from '../../../controllers/youtube';
import { IStateStore } from '../../../interfaces/Store';
import { updateCodeBDD as updateCodeBDD } from '../../../controllers/codes';
import { IActualMonacoModelAction, updateActualMonacoModel } from '../../../actions/actualMonacoModel';
import translate from '../../../localization';
import { Icon } from 'antd';

const md = _md({
    html: true,
    linkify: true,
    langPrefix: `hljs language-`,
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) { }
        }

        return '';
    },
})
// Remember old renderer, if overridden, or proxy to default renderer
var defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {

    if (tokens[idx].attrIndex('href') >= 0 && tokens[idx].attrs[tokens[idx].attrIndex('href')][1].match(/^#/)) return defaultRender(tokens, idx, options, env, self);

    // If you are sure other plugins can't add `target` - drop check below
    var aIndex = tokens[idx].attrIndex('target');

    if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
        tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};

interface IProps extends IStateToProps, IDispatchToProps {
    codesLoaded: boolean;
}

interface IState {
    monacoTheme: 'vs' | 'vs-dark';
    iconLoading: boolean;
    textMarkdown: string;
    isMarkdownFile: boolean;
}

class MonacoEditor extends React.Component<IProps, IState> {

    savableCondition: monaco.editor.IContextKey<any>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            monacoTheme: localStorage.getItem('theme') as IState['monacoTheme'] || 'vs-dark',
            iconLoading: false,
            textMarkdown: '',
            isMarkdownFile: false,
        }
    }

    componentDidMount() {
        this.props.incrementLoading();
        if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'vs-dark');

        const editor = monaco.editor.create(document.getElementById("monaco"), {
            language: "plaintext",
            theme: this.state.monacoTheme,
            automaticLayout: true,
            minimap: {
                enabled: false,
            },
            readOnly: true,
        });
        MonacoEditorController.editor = editor;
        MonacoEditorController.setEmptyModel();

        editor.onDidChangeModelContent(event => {
            const value = editor.getValue();
            const { codes, activeCodeIndex, updateCode, actualMonacoModel } = this.props;

            if (activeCodeIndex !== null && actualMonacoModel !== MonacoEditorController.githubModel) {
                YouTubeController.pause();
                const code = codes[activeCodeIndex];

                if (!code.github.user) {
                    if (code.upToDate === undefined || code.upToDate) updateCode({ upToDate: false, }, activeCodeIndex);
                    clearTimeout(MonacoEditorController.models[code.uuid].timeout);
                    MonacoEditorController.models[code.uuid].timeout = setTimeout(() => {
                        updateCodeBDD({ value, }, YouTubeController.videoId, code.uuid).then(response => {
                            updateCode({ value: response.data.value, upToDate: true, }, activeCodeIndex);
                        });
                    }, 1337);
                }
            }
        });

        editor.addAction({
            id: 'theme',
            label: translate('switchTheme'),
            keybindings: [],
            precondition: null,
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1,
            run: editor => {
                let theme: IState['monacoTheme'] = localStorage.getItem('theme') === 'vs' ? 'vs-dark' : 'vs';
                localStorage.setItem('theme', theme);
                this.setState({ monacoTheme: theme });
                monaco.editor.setTheme(theme);
                return null;
            }
        });

        this.props.decrementLoading();
    }

    componentWillReceiveProps(nextProps: IProps) {
        if (this.props.codesLoaded !== nextProps.codesLoaded && nextProps.codesLoaded) {
            // Creation des models
            MonacoEditorController.models = {};
            nextProps.codes.forEach(code => {
                let model = monaco.editor.createModel(code.value || 'Loading...', code.mode);

                MonacoEditorController.models = {
                    ...MonacoEditorController.models,
                    [code.uuid]: {
                        model,
                        readOnly: !this.props.isLogged || !this.props.itsMyVideo || code.value === null,
                        timeout: null,
                    }
                }
            });
        }
        if (nextProps.activeCodeIndex !== null) {
            const code = nextProps.codes[nextProps.activeCodeIndex];
            if (code) {
                if (nextProps.actualMonacoModel === MonacoEditorController.githubModel) {
                    MonacoEditorController.setGitHubModel();
                    try {
                        this.setState({
                            textMarkdown: MonacoEditorController.githubLanguage === 'markdown' ? md.render(MonacoEditorController.githubModel.getValue()) : '',
                            isMarkdownFile: MonacoEditorController.githubLanguage === 'markdown',
                        });
                    } catch{ }
                }
                else {
                    try {
                        this.setState({
                            textMarkdown: (!this.props.itsMyVideo && code.mode === 'markdown') ? md.render(code.value) : '',
                            isMarkdownFile: code.mode === 'markdown',
                        });
                    } catch{ }
                    MonacoEditorController.setCodeModel(code.uuid);
                }
            }
        } else {
            if (nextProps.actualMonacoModel === MonacoEditorController.githubModel) {
                MonacoEditorController.setGitHubModel();
                try {
                    this.setState({
                        textMarkdown: MonacoEditorController.githubLanguage === 'markdown' ? md.render(MonacoEditorController.githubModel.getValue()) : '',
                        isMarkdownFile: MonacoEditorController.githubLanguage === 'markdown',
                    });
                } catch{ }
            } else {
                this.setState({ isMarkdownFile: false, textMarkdown: '' });
                MonacoEditorController.setEmptyModel();
            }
        }
    }

    render = () => {
        return (
            <div id="monaco-editor">
                {(this.state.isMarkdownFile || this.state.textMarkdown) && (
                    <Icon
                        className="close"
                        type={this.state.iconLoading ? 'loading' : this.state.textMarkdown ? 'edit' : 'eye'}
                        style={{ color: this.state.textMarkdown ? 'black' : this.state.monacoTheme === 'vs' ? 'black' : 'white' }}
                        onClick={() => {
                            this.setState({ iconLoading: true });
                            setTimeout(() => {
                                this.setState({ iconLoading: false, textMarkdown: this.state.textMarkdown ? '' : md.render(MonacoEditorController.editor.getValue()) });
                            }, 100);
                        }}
                    />
                )}
                <div id="monaco" style={{ display: this.state.textMarkdown ? 'none' : 'block' }}></div>
                {this.state.textMarkdown && (
                    <div id="markdown" className={`markdown-body ${this.state.monacoTheme === 'vs' ? 'light' : 'dark'}`} dangerouslySetInnerHTML={{ __html: this.state.textMarkdown }}></div>
                )}
            </div>
        )
    }
}

interface IStateToProps {
    isLogged: IStateStore['isLogged'];
    itsMyVideo: IStateStore['itsMyVideo'];
    codes: IStateStore['codes'];
    activeCodeIndex: IStateStore['activeCodeIndex'];
    actualMonacoModel: IStateStore['actualMonacoModel'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        isLogged: state.isLogged,
        itsMyVideo: state.itsMyVideo,
        codes: state.codes,
        activeCodeIndex: state.activeCodeIndex,
        actualMonacoModel: state.actualMonacoModel,
    }
};

interface IDispatchToProps {
    incrementLoading: ILoadingAction['incrementLoading'];
    decrementLoading: ILoadingAction['decrementLoading'];
    updateCode: ICodesAction['updateCode'];
    updateActualMonacoModel: IActualMonacoModelAction['updateActualMonacoModel'];
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        incrementLoading: bindActionCreators(incrementLoading, dispatch),
        decrementLoading: bindActionCreators(decrementLoading, dispatch),
        updateCode: bindActionCreators(updateCode, dispatch),
        updateActualMonacoModel: bindActionCreators(updateActualMonacoModel, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonacoEditor);
