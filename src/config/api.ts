export const API_BASE_URL = 'http://127.0.0.1:8000';
export const API_ENDPOINTS = {
    hotels: `${API_BASE_URL}/api/hotels/`,
};

export const API_CONFIG = {
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'include' as RequestCredentials,
}; 