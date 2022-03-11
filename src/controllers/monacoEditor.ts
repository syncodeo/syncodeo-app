import * as monaco from 'monaco-editor';

export type MonacoModel = 'github' | 'timeline' | 'timehub';

class MonacoEditor {
    editor?: monaco.editor.IStandaloneCodeEditor;

    //Models
    githubModel: monaco.editor.ITextModel = monaco.editor.createModel('');
    emptyModel: monaco.editor.ITextModel = monaco.editor.createModel('No code selected...');
    models: {
        [key: string]: {
            model: monaco.editor.ITextModel;
            readOnly: boolean;
            timeout: any;
        }
    };
    timeout: any;
    githubLanguage: string = "";

    createModel(uuid: string, language: string) {
        this.models = {
            ...this.models,
            [uuid]: {
                model: monaco.editor.createModel('//Paste your code here...', language),
                readOnly: false,
                timeout: null,
            }
        }
    }

    updateCodeModel(uuid: string, value: string, language: string, readOnly?: boolean) {
        this.setCodeValue(uuid, value);
        this.setCodeLanguage(uuid, language);
        try {
            this.models[uuid].readOnly = readOnly;
        } catch{ }
    }

    setReadOnly(readOnly: boolean) {
        this.editor.updateOptions({ readOnly, });
    }

    deleteModel(uuid: string) {
        try {
            delete this.models[uuid];
        } catch{ }
    }

    setCodeModel(uuid: string) {
        try {
            this.editor.setModel(this.models[uuid].model);
            this.editor.updateOptions({ readOnly: this.models[uuid].readOnly });
        } catch{ }
    }

    setCodeLanguage(uuid: string, value: string) {
        try {
            monaco.editor.setModelLanguage(this.models[uuid].model, value);
        } catch{ }
    }

    setEmptyModel() {
        this.editor.setModel(this.emptyModel);
        this.setReadOnly(true);
    }

    setCodeValue(uuid: string, value: string) {
        try {
            this.models[uuid].model.setValue(value);
        } catch{ }
    }

    getCodeValue(uuid: string) {
        try {
            this.models[uuid].model.getValue();
        } catch{ }
    }

    setGitHubModel() {
        this.editor.setModel(this.githubModel);
        this.setReadOnly(true);
    }

    setGitHubLanguage(language: string) {
        this.githubLanguage = language;
        monaco.editor.setModelLanguage(this.githubModel, language);
    }

    setGitHubValue(value: string) {
        this.githubModel.setValue(value);
    }

    autoDetect(filename: string) {
        for (let language of monaco.languages.getLanguages()) {
            for (let extension of language.extensions) {
                if (filename.match(extension + '$')) {
                    this.githubLanguage = language.id;
                    monaco.editor.setModelLanguage(this.githubModel, language.id);
                    return;
                }
            }
        }
        this.githubLanguage = "plaintext";
        monaco.editor.setModelLanguage(this.githubModel, 'plaintext');
    }
}

export default new MonacoEditor();