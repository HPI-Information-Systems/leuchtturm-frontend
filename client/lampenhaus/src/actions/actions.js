/* empty endpoint means that later on, fetch will try to send
requests to the endpoint it's served from (e.g. localhost:5000) */
let endpoint = '';
// if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
if (process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
}

const getGlobalFilterParameters = state => (
    `&start_date=${state.globalFilter.startDate}&end_date=${state.globalFilter.endDate}`
);

export const updateSearchTerm = searchTerm => ({
    type: 'UPDATE_SEARCH_TERM',
    searchTerm,
});

export const submitMailSearch = searchTerm => ({
    type: 'SUBMIT_MAIL_SEARCH',
    searchTerm,
});

export const processMailResults = json => ({
    type: 'PROCESS_MAIL_RESULTS',
    response: json.response,
});

export const submitDocIdListSearch = searchTerm => ({
    type: 'SUBMIT_DOC_ID_LIST_SEARCH',
    searchTerm,
});

export const processDocIdListResults = json => ({
    type: 'PROCESS_DOC_ID_LIST_RESULTS',
    response: json.response,
});

export const requestDocIdList = searchTerm => (dispatch, getState) => {
    dispatch(submitDocIdListSearch(searchTerm));

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/search?term=${searchTerm}` +
        `&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(processDocIdListResults(json)));
};

export const submitCorrespondentSearch = searchTerm => ({
    type: 'SUBMIT_CORRESPONDENT_SEARCH',
    searchTerm,
});

export const processCorrespondentResults = json => ({
    type: 'PROCESS_CORRESPONDENT_RESULTS',
    response: json.response,
});

export const changePageNumberTo = pageNumber => ({
    type: 'CHANGE_PAGE_NUMBER_TO',
    pageNumber,
});

export const requestSearchResultPage = (searchTerm, resultsPerPage, pageNumber) => (dispatch, getState) => {
    dispatch(changePageNumberTo(pageNumber));
    dispatch(submitMailSearch(searchTerm));

    const offset = (pageNumber - 1) * resultsPerPage;

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/search?term=${searchTerm}` +
        `&offset=${offset}&limit=${resultsPerPage}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(processMailResults(json)));
};

export const requestCorrespondentResult = searchTerm => (dispatch, getState) => {
    dispatch(submitCorrespondentSearch(searchTerm));

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/term/correspondents?term=${searchTerm}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(processCorrespondentResults(json)));
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

export const requestCorrespondents = emailAddress => (dispatch, getState) => {
    dispatch(submitCorrespondentRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/correspondent/correspondents?email_address=${emailAddress}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
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

export const requestTerms = emailAddress => (dispatch, getState) => {
    dispatch(submitTermRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/correspondent/terms?email_address=${emailAddress}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with term information', error),
        ).then(json => dispatch(processTermsResponse(json)));
};

export const submitTermDatesRequest = () => ({
    type: 'SUBMIT_TERM_DATES_REQUEST',
});

export const processTermDatesResponse = json => ({
    type: 'PROCESS_TERM_DATES_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestTermDates = searchTerm => (dispatch, getState) => {
    dispatch(submitTermDatesRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/term/dates?term=${searchTerm}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with topic information', error),
        ).then(json => dispatch(processTermDatesResponse(json)));
};

export const submitSenderRecipientEmailListRequest = () => ({
    type: 'SUBMIT_SENDER_RECIPIENT_EMAIL_LIST_REQUEST',
});

export const processSenderRecipientEmailListResponse = json => ({
    type: 'PROCESS_SENDER_RECIPIENT_EMAIL_LIST_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestSenderRecipientEmailList = (from, to) => (dispatch, getState) => {
    dispatch(submitSenderRecipientEmailListRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/sender_recipient_email_list?sender=${from}&recipient=${to}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with term information', error),
        ).then(json => dispatch(processSenderRecipientEmailListResponse(json)));
};

export const submitTopicRequest = () => ({
    type: 'SUBMIT_TOPICS_REQUEST',
});

export const processTopicsResponse = json => ({
    type: 'PROCESS_TOPICS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestTopics = emailAddress => (dispatch, getState) => {
    dispatch(submitTopicRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/correspondent/topics?email_address=${emailAddress}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with topic information', error),
        ).then(json => dispatch(processTopicsResponse(json)));
};

export const submitGraphRequest = () => ({
    type: 'SUBMIT_GRAPH_REQUEST',
});

export const processGraphResponse = json => ({
    type: 'PROCESS_GRAPH_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestGraph = (emailAddresses, neighbours) => (dispatch, getState) => {
    dispatch(submitGraphRequest());
    const emailAddressParams = `${emailAddresses.reduce((prev, curr) => [`${prev}&email_address=${curr}`])}`;

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/graph?email_address=${emailAddressParams}` +
        `&neighbours=${neighbours}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with graph information', error),
        ).then(json => dispatch(processGraphResponse(json)));
};

export const submitMatrixRequest = () => ({
    type: 'SUBMIT_MATRIX_REQUEST',
});

export const processMatrixResponse = json => ({
    type: 'PROCESS_MATRIX_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMatrix = () => (dispatch, getState) => {
    dispatch(submitMatrixRequest());

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${endpoint}/api/matrix/full?dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with matrix information', error),
        ).then(json => dispatch(processMatrixResponse(json)));
};

export const submitMatrixHighlightingRequest = () => ({
    type: 'SUBMIT_MATRIX_HIGHLIGHTING_REQUEST',
});

export const processMatrixHighlightingResponse = json => ({
    type: 'PROCESS_MATRIX_HIGHLIGHTING_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMatrixHighlighting = correspondents => (dispatch, getState) => {
    dispatch(submitMatrixHighlightingRequest());
    const correspondentParams = `${correspondents.reduce((prev, curr) => [`${prev}&correspondent=${curr}`])}`;

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${endpoint}/api/matrix/highlighting?dataset=${dataset}&correspondent=${correspondentParams}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error(
                'An error occurred while parsing response with matrix-highlighting information',
                error,
            ),
        ).then(json => dispatch(processMatrixHighlightingResponse(json)));
};

export const setDocId = docId => ({
    type: 'SET_DOC_ID',
    docId,
});

export const submitEmailRequest = () => ({
    type: 'SUBMIT_EMAIL_REQUEST',
});

export const processEmailResponse = json => ({
    type: 'PROCESS_EMAIL_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestEmail = docId => (dispatch, getState) => {
    dispatch(submitEmailRequest());

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${endpoint}/api/email?doc_id=${docId}&dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with email information', error),
        ).then(json => dispatch(processEmailResponse(json)));
};

export const submitSimilarEmailsRequest = () => ({
    type: 'SUBMIT_SIMILAR_EMAILS_REQUEST',
});

export const processSimilarEmailsResponse = json => ({
    type: 'PROCESS_SIMILAR_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestSimilarEmails = docId => (dispatch, getState) => {
    dispatch(submitSimilarEmailsRequest());

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${endpoint}/api/email/similar?doc_id=${docId}&dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with similar emails information', error),
        ).then(json => dispatch(processSimilarEmailsResponse(json)));
};

export const setBodyType = type => ({
    type: `SET_BODY_TYPE_${type.toUpperCase()}`,
});

export const submitMailboxAllEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_ALL_EMAILS_REQUEST',
});

export const processMailboxAllEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_ALL_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMailboxAllEmails = email => (dispatch, getState) => {
    dispatch(submitMailboxAllEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/sender_recipient_email_list?sender_or_recipient=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with all emails information', error),
        ).then(json => dispatch(processMailboxAllEmailsResponse(json)));
};

export const submitMailboxSentEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_SENT_EMAILS_REQUEST',
});

export const processMailboxSentEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_SENT_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMailboxSentEmails = email => (dispatch, getState) => {
    dispatch(submitMailboxSentEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/sender_recipient_email_list?sender=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with sender emails information', error),
        ).then(json => dispatch(processMailboxSentEmailsResponse(json)));
};

export const submitMailboxReceivedEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_RECEIVED_EMAILS_REQUEST',
});

export const processMailboxReceivedEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_RECEIVED_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMailboxReceivedEmails = email => (dispatch, getState) => {
    dispatch(submitMailboxReceivedEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${endpoint}/api/sender_recipient_email_list?recipient=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with recipient emails information', error),
        ).then(json => dispatch(processMailboxReceivedEmailsResponse(json)));
};

export const submitDatasetsRequest = () => ({
    type: 'SUBMIT_DATASETS_REQUEST',
});

export const processDatasetsResponse = json => ({
    type: 'PROCESS_DATASETS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestDatasets = () => (dispatch) => {
    dispatch(submitDatasetsRequest());
    return fetch(`${endpoint}/api/datasets`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with dataset information', error),
        ).then(json => dispatch(processDatasetsResponse(json)));
};

export const setSelectedDataset = selectedDataset => ({
    type: 'SET_SELECTED_DATASET',
    dataset: selectedDataset,
});

export const setStartDate = startDate => ({
    type: 'SET_START_DATE',
    startDate,
});

export const setEndDate = endDate => ({
    type: 'SET_END_DATE',
    endDate,
});
