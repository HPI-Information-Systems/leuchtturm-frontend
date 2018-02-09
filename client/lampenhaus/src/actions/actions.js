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

export const submitSearch = searchTerm => ({
    type: 'SUBMIT_SEARCH',
    searchTerm,
});

export const receiveResults = json => ({
    type: 'RECEIVE_RESULTS',
    response: json.response,
});

export const changePageNumberTo = pageNumber => ({
    type: 'CHANGE_PAGE_NUMBER_TO',
    pageNumber,
});

export const requestSearchResultPage = (searchTerm, resultsPerPage, pageNumber) => (dispatch) => {
    dispatch(changePageNumberTo(pageNumber));
    dispatch(submitSearch(searchTerm));

    const offset = (pageNumber - 1) * resultsPerPage;

    return fetch(`${endpoint}/api/search?search_term=${searchTerm}&offset=${offset}&limit=${resultsPerPage}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(receiveResults(json)));
};

export const setCorrespondentEmailAddress = emailAddress => ({
    type: 'SET_CORRESPONDENT_EMAIL_ADDRESS',
    emailAddress,
});

export const submitCorrespondentRequest = () => ({
    type: 'SUBMIT_CORRESPONDENT_REQUEST',
});

export const processCorrespondentsResponse = json => ({
    type: 'PROCESS_CORRESPONDENTS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestCorrespondents = emailAddress => (dispatch) => {
    dispatch(submitCorrespondentRequest());

    return fetch(`${endpoint}/api/correspondents?email_address=${emailAddress}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with correspondent information', error),
        ).then(json => dispatch(processCorrespondentsResponse(json)));
};

export const submitTermRequest = () => ({
    type: 'SUBMIT_TERM_REQUEST',
});

export const processTermsResponse = json => ({
    type: 'PROCESS_TERMS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestTerms = emailAddress => (dispatch) => {
    dispatch(submitTermRequest());

    return fetch(`${endpoint}/api/terms?email_address=${emailAddress}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with term information', error),
        ).then(json => dispatch(processTermsResponse(json)));
};

export const submitCommunicationRequest = () => ({
    type: 'SUBMIT_COMMUNICATION_REQUEST',
});

export const processCommunicationResponse = json => ({
    type: 'PROCESS_COMMUNICATION_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestCommunication = (sender, receiver) => (dispatch) => {
    dispatch(submitCommunicationRequest());

    return fetch(`${endpoint}/api/communication?sender=${sender}&receiver=${receiver}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with term information', error),
        ).then(json => dispatch(processCommunicationResponse(json)));
};

export const submitGraphRequest = () => ({
    type: 'SUBMIT_GRAPH_REQUEST',
});

export const processGraphResponse = json => ({
    type: 'PROCESS_GRAPH_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestGraph = emailAddress => (dispatch) => {
    dispatch(submitGraphRequest());

    return fetch(`${endpoint}/api/graph?mail=${emailAddress}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with graph information', error),
        ).then(json => dispatch(processGraphResponse(json)));
};
