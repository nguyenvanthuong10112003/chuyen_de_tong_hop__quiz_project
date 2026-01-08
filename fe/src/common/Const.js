export const KEY = {
    API_BASE_URL: 'http://localhost:8080/quiz/api/v1',
    LOCAL_STORAGE: {
        AUTH_TOKEN: "authToken",
        USER_ID: "userId",
        USER_DISPLAY_NAME: "userDisplayName",
        MESSAGE: "toastMessage"
    },
    QUESTION_TYPE: {
        CHOICE: 'CHOICE', 
        MULTI_CHOICE: 'MULTI_CHOICE'
    }
}
export const ROUTER_PAGE = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register'
    },
    CLASS: {
        INDEX: '/class',
        ADD: '/class/add',
        EDIT: '/class/edit',
        DETAIL: '/class/:id'
    },
    QUESTION: { 
        INDEX: '/question',
        ADD: '/question/add',
        EDIT: '/question/edit'
    },
    TEST: {
        ADD: '/test/add',
        EDIT: '/test/edit',
        INDEX: '/test',
        VIEW: '/test/:id'
    },
    HOME: {
        INDEX: '/home'
    }
}
export const PROPERTY = {
    VALID_DURATION: 3600,
    REFRESH_VALID_DURATION: 7200,
    DEFAULT_PAGE_SIZE: 10
}
 
export const DEFINE_TYPE = {
    ONLY: 'ONLY_QUESTION',
    GROUP: 'GROUP'
}

export const DEFINE_DIFFICULTY = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD'
};

export const CONTENT_TYPE = {
    TEXT: 'TEXT',
    PHOTO: 'PHOTO'
}

export const DEFAULT_CLASS_IMAGE = '/image/class_default.jpg';

export const REQUEST_TYPE = {
    INVITE: 'INVITE', 
    REQUEST: 'REQUEST'
}

export const ENTER_LINE = '\n';
export const SPACE_HTML = "&nbsp;"
