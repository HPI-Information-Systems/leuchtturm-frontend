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

export const processCorrespondentResponse = json => ({
    type: 'PROCESS_CORRESPONDENT_RESPONSE',
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
        ).then(json => dispatch(processCorrespondentResponse(json)));
};
