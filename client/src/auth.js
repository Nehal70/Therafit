// auth.js
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const isAuthenticated = () => {
    return !!getAuthToken(); // If there's a token, the user is authenticated
};
