export const REGEX_ID_VIDEO_YOUTUBE = /[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]/
export const REGEX_GITHUB = /^https:\/\/github\.com\/([^\/]*)\/([^\/]*)(?:\/[^\/]*\/([^\/]*)(?:\/(.*))?)?$/; 
export const REGEX_GITHUB_FILE = /^https:\/\/github\.com\/([^\/]*)\/([^\/]*)\/blob\/([^\/]*)\/(.+)$/; 
export const REGEX_DOWNLOAD_GITHUB = /^https:\/\/raw.githubusercontent.com\/([^\/]*)\/([^\/]*)\/([^\/]*)\/(.+)$/;
export const REGEX_URL = /(https?:\/\/[^\s]*)/g;
export const REGEX_MINUTE = /([0-9]+:[0-9][0-9])/g;
export const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;