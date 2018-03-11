/* empty endpoint means that later on, fetch will try to send
requests to the endpoint it's served from (e.g. localhost:5000) */
let endpoint = '';
// if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
if (process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
}

/* TODO: for development purposes until we can set the dataset in the frontend,
it is read from an environment variable */
let dataset = 'enron';
if (process.env.REACT_APP_DATASET) {
    dataset = process.env.REACT_APP_DATASET;
}

export const updateSearchTerm = searchTerm => ({
    type: 'UPDATE_SEARCH_TERM',
    searchTerm,
});

export const submitMailSearch = searchTerm => ({
    type: 'SUBMIT_MAIL_SEARCH',
    searchTerm,
});

export const receiveMailResults = json => ({
    type: 'RECEIVE_MAIL_RESULTS',
    response: json.response,
});

export const submitCorrespondentSearch = searchTerm => ({
    type: 'SUBMIT_CORRESPONDENT_SEARCH',
    searchTerm,
});

export const receiveCorrespondentResults = json => ({
    type: 'RECEIVE_CORRESPONDENT_RESULTS',
    response: json.response,
});

export const changePageNumberTo = pageNumber => ({
    type: 'CHANGE_PAGE_NUMBER_TO',
    pageNumber,
});

export const requestSearchResultPage = (searchTerm, resultsPerPage, pageNumber) => (dispatch) => {
    dispatch(changePageNumberTo(pageNumber));
    dispatch(submitMailSearch(searchTerm));

    const offset = (pageNumber - 1) * resultsPerPage;

    return fetch(`${endpoint}/api/search?search_term=${searchTerm}&offset=${offset}
                  &limit=${resultsPerPage}&dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(receiveMailResults(json)));
};

export const requestCorrespondentResult = searchTerm => (dispatch) => {
    dispatch(submitCorrespondentSearch(searchTerm));

    return fetch(`${endpoint}/api/correspondents_for_term?term=${searchTerm}&dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(receiveCorrespondentResults(json)));
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

    return fetch(`${endpoint}/api/correspondents?email_address=${emailAddress}&dataset=${dataset}`)
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

    return fetch(`${endpoint}/api/terms?email_address=${emailAddress}&dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with term information', error),
        ).then(json => dispatch(processTermsResponse(json)));
};

export const submitSenderRecipientEmailListRequest = () => ({
    type: 'SUBMIT_SENDER_RECIPIENT_EMAIL_LIST_REQUEST',
});

export const processSenderRecipientEmailListResponse = json => ({
    type: 'PROCESS_SENDER_RECIPIENT_EMAIL_LIST_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestSenderRecipientEmailList = (from, to) => (dispatch) => {
    dispatch(submitSenderRecipientEmailListRequest());

    return fetch(`${endpoint}/api/sender_recipient_email_list?sender=${from}&recipient=${to}&dataset=${dataset}`)
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

export const requestTopics = emailAddress => (dispatch) => {
    dispatch(submitTopicRequest());

    return fetch(`${endpoint}/api/topics?email_address=${emailAddress}&dataset=${dataset}`)
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

export const requestGraph = emailAddresses => (dispatch) => {
    dispatch(submitGraphRequest());
    const emailAddressParams = `${emailAddresses.reduce((prev, curr) => [`${prev}&email_address=${curr}`])}`;

    return fetch(`${endpoint}/api/graph?email_address=${emailAddressParams}&dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with graph information', error),
        ).then(json => dispatch(processGraphResponse(json)));
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

export const requestEmail = docId => (dispatch) => {
    dispatch(submitEmailRequest());

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

export const requestSimilarEmails = docId => (dispatch) => {
    dispatch(submitSimilarEmailsRequest());

    return fetch(`${endpoint}/api/similar_mails?doc_id=${docId}&dataset=${dataset}`)
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

export const requestMailboxAllEmails = email => (dispatch) => {
    dispatch(submitMailboxAllEmailsRequest());

    return fetch(`${endpoint}/api/sender_recipient_email_list?sender_or_recipient=${email}&dataset=${dataset}`)
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

export const requestMailboxSentEmails = email => (dispatch) => {
    dispatch(submitMailboxSentEmailsRequest());

    return fetch(`${endpoint}/api/sender_recipient_email_list?sender=${email}&dataset=${dataset}`)
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

export const requestMailboxReceivedEmails = email => (dispatch) => {
    dispatch(submitMailboxReceivedEmailsRequest());

    return fetch(`${endpoint}/api/sender_recipient_email_list?recipient=${email}&dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with recipient emails information', error),
        ).then(json => dispatch(processMailboxReceivedEmailsResponse(json)));
};
