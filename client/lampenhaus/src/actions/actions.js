/* empty endpoint means that later on, fetch will try to send
requests to the endpoint it's served from (e.g. localhost:5000) */
let endpoint = '';
// if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
if (process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
}

export const updateSearchTerm = searchTerm => ({
    type: 'UPDATE_SEARCH_TERM',
    searchTerm,
});

export const submitSearch = () => ({
    type: 'SUBMIT_SEARCH',
});

export const setEntitySearch = boolean => ({
    type: 'SET_ENTITY_SEARCH',
    isEntitySearch: boolean,
});

export const receiveResults = json => ({
    type: 'RECEIVE_RESULTS',
    response: json.response,
});

export const changePageNumberTo = pageNumber => ({
    type: 'CHANGE_PAGE_NUMBER_TO',
    pageNumber,
});

export const requestPage = (searchTerm, resultsPerPage, pageNumber) => (dispatch) => {
    dispatch(changePageNumberTo(pageNumber));
    // TODO: choose less general wording
    dispatch(submitSearch());

    const offset = (pageNumber - 1) * resultsPerPage;

    return fetch(`${endpoint}/api/search?search_term=${searchTerm}&offset=${offset}&limit=${resultsPerPage}`)
        .then(
            response => response.json(),
            // TODO: choose less general wording
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(receiveResults(json)));
};

export const submitCorrespondentRequest = emailAddress => ({
    type: 'SUBMIT_CORRESPONDENT_REQUEST',
    emailAddress,
});

export const processCorrespondentsResponse = json => ({
    type: 'PROCESS_CORRESPONDENTS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestCorrespondents = emailAddress => (dispatch) => {
    dispatch(submitCorrespondentRequest(emailAddress));

    return fetch(`${endpoint}/api/correspondents?email_address=${emailAddress}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with correspondent information', error),
        ).then(json => dispatch(processCorrespondentsResponse(json)));
};

export const submitTermRequest = emailAddress => ({
    type: 'SUBMIT_TERM_REQUEST',
    emailAddress,
});

export const processTermsResponse = json => ({
    type: 'PROCESS_TERMS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestTerms = emailAddress => (dispatch) => {
    dispatch(submitTermRequest(emailAddress));

    return fetch(`${endpoint}/api/terms/mock?email_address=${emailAddress}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with term information', error),
        ).then(json => dispatch(processTermsResponse(json)));
};
