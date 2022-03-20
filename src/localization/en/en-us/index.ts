import errorsServer from './errorsServer';
import alert from './alert';
import errorsLocal from './errorsLocal';
import difficulty from './difficulty';
import feedback from './feedback';
import tooltip from './tooltip';
import language from './language';


export default {
    ...errorsServer,
    ...errorsLocal,
    ...alert,
    ...difficulty,
    ...feedback,
    ...tooltip,
    ...language,

    // Modal title
    'addPlaylist': 'Add playlist',

    // Smth
    'addSmth': 'Add {{smth}}',
    'smthLink': '{{smth}} link',
    'smthPage': '{{smth}} page',

    // Socket io
    'addedAVideo': 'added a video!',
    'updatedAVideo': 'updated the data of a video!',
    'addedCodeOnVideo': 'added a code on a video!',
    'updateCodeOnVideo': 'updated a code on a video!',

    // Login
    'errorIdentifyingYou': 'Error while identifying you!',
    'errorSigningIn': 'Error while signing in!',
    'errorSigningOut': 'Error while signing out!',
    'youSignedOut': 'You signed out!',
    'login': 'Login',
    'logout': 'Logout',

    // Code
    'pasteCodeHere': '//Paste your code here',
    'noCodeHere': 'There is no code here 🚀',
    'upToDate': 'Up to date',
    'saving': 'Saving...',

    // GitHub
    'editGithubFile': 'Edit your GitHub file',
    'linkGithubFile': 'Link your GitHub file',
    'openFileGithub': 'Open file in GitHub',
    'githubLinkBelow': 'Enter your GitHub file link below',
    'copyLinkClipboard': 'Copy link to clipboard',
    'github': 'GitHub',

    // Video
    'openOnYoutube': 'Open video on YouTube',
    'openGithubRepository': 'Open GitHub repository',
    'timeline': 'Timeline',
    'information': 'Informations',
    'noDescription': 'No description...',
    'shareVideo': 'Share the video',
    'shareCodeVideo': 'Share the video at this time',

    // Monaco editor
    'switchTheme': 'Switch theme',
    'saveCode': 'Save code',
    'noCodeSelected': 'No code selected...',

    // Titles
    "filters": 'Filters',

    // Others
    'urlCopiedClipboard': 'The URL has been copied to the clipboard💖',
    'cantOpenBinaryFile': 'We can\'t open binary file...',

    'linkYoutubeAccount': 'Link your YouTube account',
    'needLinkYoutubeAccountLinkVideo': 'You need to link your YouTube account to add a video.',
    'needBeLogin': 'You need to be login!',
    'clickToLogin': 'Click here to login...',
    'clickToLinkYoutubeAccount': 'Click here to link your YouTube account😄',

    // Left Menu
    'tutorial': 'Tutorial',
    'playlists': 'Playlists',
    'playlist': 'Playlist',
    'yourPlaylists': 'Your playlists',

    'clickToAddOne': 'Click here to add one!',
    'noPlaylist': 'No playlist...',
    'noVideo': 'No video',
    'noData': 'No data',
    'or': 'or',
    'ok': 'Ok',
    'cancel': 'Cancel',
    'refresh': 'Refresh',
    'continue': 'Continue',
    'image': 'Image',
    'title': 'Title',
    'description': 'Description',
    'visibility': 'Visibility',
    'private': 'Private',
    'public': 'Public',
    'unlisted': 'Unlisted',
    'action': 'Actions',
    'addVideo': 'Add a video',
    'addVideoOnSyncodeo': 'Add on Syncodeo',
    'watchOnYoutube': 'Watch on Youtube',
    'alreadyAdded': 'Already added',
    'byVideoId': 'By video id',
    'byMostRecentVideos': 'By most recent videos',
    'videoYoutubeId': 'Video YouTube id',
    'chooseTitle': 'Choose a title',
    'chooseLanguage': 'Choose a language',
    'warningPrivateSyncodeo': 'Make sure your YouTube video is public or unlisted for Syncodeo to work well.',
    'language': 'Language',
    'difficulty': 'Difficulty',
    'collaborators': 'Collaborators',
    'collaboratorsSuccessfullyAdded': 'Collaborators successfully added!',
    'tags': 'Tags',

    'anErrorOccured': 'An error has occured...',

    'watch': 'Watch',
    'watchOrEdit': 'Watch/Edit',
    'settings': 'Settings',
    'edit': 'Edit',
    'delete': 'Delete',
    'video': 'Video',
    'videos': 'Videos',
    'contacts': 'Get in touch',
    'home': 'Home',
    'search': 'Search',
    'layout': 'Layout',
    'dashboard': 'Dashboard',
    'channel': 'Channel',
    'yourChannel': 'Your channel',
    'terms': 'Terms',

    'one': 'One',
    'two': 'Two',

    'yourVideos': 'Your videos',
    'collaborativesVideo': 'Collaborative videos',
    'editAVideo': 'Edit a video',
    'updateVideo': 'Update video',
    'videoSuccessfullyModified': 'The video is successfully modified',

    /**
     * PAGES
     */

    // Home


    // Browse
    'recentlyUpdated': 'Recently updated videos',

    // NotFound
    'goHome': 'Go home',

    // Search
    'loadMore': 'Load more',
    'languagePlaceholder': 'Select a language',
    'difficultyPlaceholder': 'Select a difficulty',
    'searchQueryPlaceholder': 'Enter your query here...',
    'results': 'Results',

    // Lean-more
    'story': 'Story',
}