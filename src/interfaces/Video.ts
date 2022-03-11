export default interface Video {
    videoId?: string;
    difficulty?: string;
    language?: string;
    title?: string;
    collaborators?: string[];
    tags?: string[];
    visibility?: 'public' | 'private' | 'unlisted';
    
    registered?: boolean;
    status?: 'public' | 'private' | 'unlisted';
    key?: string;
    github?: string;
    author_name?: string;
    duration?: number;
    author_url?: string;
    isYoutubeTitle?: boolean;
    thumbnail_url?: string;
    description?: string;
    loading?: boolean;
    showMore?: boolean;
}