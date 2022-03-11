import './Explorer.less';
// React & Redux
import React from 'react';
import { connect } from 'react-redux';

// Components
import { Tree, message, Icon, Menu, Dropdown, Spin, } from 'antd';

// Controllers
import MonacoEditorController from '../../../controllers/monacoEditor';
import { getGithubRepoFiles, downloadFile } from '../../../controllers/github';
import { IActualMonacoModelAction, updateActualMonacoModel } from '../../../actions/actualMonacoModel';
import { bindActionCreators } from 'redux';
import translate from '../../../localization';
import { copyToClipboard } from '../../../helpers/functions';
import { IStateStore } from '../../../interfaces/Store';

interface IProps extends IStateToProps, IDispatchToProps {
    github: string;
}

interface IState {
    githubRepoLinked: boolean;
    explorerVisible: boolean;
    expandedKeys: string[];

    treeData?: any[];
}

class Explorer extends React.Component<IProps, IState> {

    formRef: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            githubRepoLinked: false,
            explorerVisible: true,
            expandedKeys: [],
        }
    }

    componentDidMount() {
        if (!this.state.treeData) {
            getGithubRepoFiles(this.props.github).then(response => {
                this.setState({
                    treeData: response as [],
                    githubRepoLinked: true,
                });
            });
        }
    }

    onLoadData = treeNode => new Promise((resolve, reject) => {
        if (treeNode.props.children) {
            resolve();
            return;
        }
        getGithubRepoFiles(this.props.github, treeNode.props.dataRef.path).then(response => {
            treeNode.props.dataRef.children = response;
            this.setState({ treeData: [...this.state.treeData] });
            resolve();
        }).catch(error => reject(error));
    })

    renderTreeNodes = data => data.map((item) => {
        const menu = (
            <Menu>
                <Menu.Item onClick={param => param.domEvent.stopPropagation()}>
                    <a target="_blank" rel="noopener noreferrer" href={this.props.github + '/blob/' + item.branch + '/' + item.path}><Icon type="github" /> {translate('openFileGithub')}</a>
                </Menu.Item>
                <Menu.Item onClick={param => {
                    param.domEvent.stopPropagation();
                    copyToClipboard(this.props.github + '/blob/' + item.branch + '/' + item.path);
                }}>
                    <span><Icon type="copy" /> {translate('copyLinkClipboard')}</span>
                </Menu.Item>
            </Menu>
        )

        if (item.children) {
            const logo = this.state.expandedKeys.includes(item.key) ? 'folder-open' : 'folder';
            return (
                <Tree.TreeNode title={(
                    <Dropdown overlay={menu} trigger={['contextMenu']}>
                        <span className="title">{item.title}</span>
                    </Dropdown>
                )} dataRef={item} isLeaf={item.isLeaf} key={item.key} icon={<Icon type={logo} theme="filled" />}>
                    {this.renderTreeNodes(item.children)}
                </Tree.TreeNode>
            )
        }
        return (
            <Tree.TreeNode title={(
                <Dropdown overlay={menu} trigger={['contextMenu']}>
                    <span className="title">{item.title}</span>
                </Dropdown>
            )} dataRef={item} key={item.key} isLeaf={item.isLeaf} icon={item.isLeaf ? <Icon type="file-text" /> : <Icon type="folder" theme="filled" />} />
        );
    })

    render() {

        return (
            <div id="explorer">
                <Spin spinning={this.props.loading !== 0}>
                    {this.state.githubRepoLinked && this.state.treeData && (
                        <Tree.DirectoryTree loadData={this.onLoadData} showIcon onExpand={(expandedKeys => {
                            this.setState({ expandedKeys, });
                        })} onSelect={async (selectedKeys: string[], item: any) => {
                            let file = item.node.props.dataRef;
                            if (file.isLeaf) {
                                if (file.content) {
                                    MonacoEditorController.setGitHubValue(file.content);
                                    MonacoEditorController.autoDetect(file.title);
                                }
                                else if (file.download_url) {
                                    await downloadFile(file.download_url).then(response => {
                                        if (!response.headers['content-type'].match(/^text\/plain/)) {
                                            let data = this.state.treeData;
                                            let element = data.find(element => element.key === selectedKeys[0]);
                                            if (element) {
                                                element.content = 'We can\'t open binary file...';
                                                this.setState({ treeData: data, });
                                            }
                                            MonacoEditorController.setGitHubValue(translate('cantOpenBinaryFile'));
                                            MonacoEditorController.setGitHubLanguage('plaintext');
                                        } else {
                                            MonacoEditorController.setGitHubValue(response.data);
                                            MonacoEditorController.autoDetect(file.title);
                                            let data = this.state.treeData;
                                            let element = data.find(element => element.key === selectedKeys[0]);
                                            if (element) {
                                                element.content = response.data;
                                                this.setState({ treeData: data, });
                                            }
                                        }
                                    });
                                }
                                this.props.updateActualMonacoModel(MonacoEditorController.githubModel);
                            }
                        }}>
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree.DirectoryTree>
                    )}
                </Spin>
            </div>
        )
    }
}

interface IStateToProps {
    loading: IStateStore['loading'];
}

const mapStateToProps = (state: IStateStore) => {
    return {
        loading: state.loading,
    }
}

interface IDispatchToProps {
    updateActualMonacoModel: IActualMonacoModelAction['updateActualMonacoModel'],
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateActualMonacoModel: bindActionCreators(updateActualMonacoModel, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
