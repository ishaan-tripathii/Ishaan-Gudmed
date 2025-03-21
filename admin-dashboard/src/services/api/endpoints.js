export const ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token',
    },

    // Pages/Slides endpoints
    PAGES: {
        LIST: '/pages',
        DETAIL: (id) => `/pages/${id}`,
        CREATE: '/pages',
        UPDATE: (id) => `/pages/${id}`,
        DELETE: (id) => `/pages/${id}`,
    },

    // Users endpoints
    USERS: {
        LIST: '/users',
        DETAIL: (id) => `/users/${id}`,
        CREATE: '/users',
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
    },

    // Settings endpoints
    SETTINGS: {
        GET: '/settings',
        UPDATE: '/settings',
    },
}; 