export default interface Code{
    title?: string;
    value?: string;
    mode?: string;
    time?: number;
    uuid?: string;
    upToDate?: boolean;
    retrying?: number;
    github?: {
        user: string;
        repository: string;
        branch: string;
        path: string;
    };
    githubLink?: string;
}