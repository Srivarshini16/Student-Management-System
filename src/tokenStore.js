/**
 * tokenStore.js
 * A simple singleton that holds a reference to Clerk's getToken function.
 * This lets the Axios interceptor (api.js) call getToken() without needing
 * it passed down as a prop or through hooks directly.
 */

let _getToken = null;

/** Called once from App.jsx after Clerk is ready */
export const setTokenGetter = (fn) => {
    _getToken = fn;
};

/** Called by api.js interceptor before each request */
export const getClerkToken = async () => {
    if (!_getToken) return null;
    try {
        return await _getToken();
    } catch {
        return null;
    }
};
