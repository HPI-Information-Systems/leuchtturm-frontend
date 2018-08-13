export function getBaseUrl() {
    if (process.env.NODE_ENV === 'production') {
        return '/app';
    }
    return '';
}

export function getEndpoint() {
    /* empty endpoint means that later on, fetch will try to send
requests to the endpoint it's served from (e.g. localhost:5000) */
    let endpoint = '';
    // if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
    if (process.env.NODE_ENV === 'development') {
        endpoint = 'http://localhost:5000';
    }
    return endpoint;
}
