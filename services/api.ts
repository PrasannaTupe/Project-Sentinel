
const API_URL = 'http://localhost:5001/api';

export const api = {
    // Auth
    login: async (username, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.token) localStorage.setItem('auth-token', data.token);
        return data;
    },

    logout: () => {
        localStorage.removeItem('auth-token');
    },

    getToken: () => localStorage.getItem('auth-token'),

    // Headers helper
    authHeader: () => ({
        'auth-token': localStorage.getItem('auth-token') || '',
        'Content-Type': 'application/json'
    }),

    // Meetings
    uploadMeeting: async (file) => {
        const formData = new FormData();
        formData.append('video', file);

        const res = await fetch(`${API_URL}/meetings/upload`, {
            method: 'POST',
            headers: { 'auth-token': localStorage.getItem('auth-token') || '' },
            body: formData
        });
        return res.json();
    },

    getMeetings: async () => {
        const res = await fetch(`${API_URL}/meetings`, {
            headers: { 'auth-token': localStorage.getItem('auth-token') || '' }
        });
        return res.json();
    },

    getMeetingDetails: async (id) => {
        const res = await fetch(`${API_URL}/meetings/${id}`, {
            headers: { 'auth-token': localStorage.getItem('auth-token') || '' }
        });
        return res.json();
    },

    // Chat
    askGlobal: async (query) => {
        const res = await fetch(`${API_URL}/chat/global`, {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('auth-token') || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        return res.json(); // { answer, sources }
    },

    askMeeting: async (meetingId, query) => {
        const res = await fetch(`${API_URL}/chat/meeting/${meetingId}`, {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('auth-token') || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        return res.json();
    },

    // Drift
    getDrift: async () => {
        const res = await fetch(`${API_URL}/drift`, {
            headers: { 'auth-token': localStorage.getItem('auth-token') || '' }
        });
        return res.json();
    },

    // Tasks
    getTasks: async () => {
        const res = await fetch(`${API_URL}/tasks`, {
            headers: { 'auth-token': localStorage.getItem('auth-token') || '' }
        });
        return res.json();
    }
};
