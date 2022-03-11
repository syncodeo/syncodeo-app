import Video from "./Video";

export interface Playlist {
    uuid?: string;
    title?: string;
    description?: string;
    tags?: string[];
    language?: string;
    loading?: boolean;
    difficulty?: string;
    owner?: string;
    visibility?: 'public' | 'private' | 'unlisted';
    videos?: Video[];
}