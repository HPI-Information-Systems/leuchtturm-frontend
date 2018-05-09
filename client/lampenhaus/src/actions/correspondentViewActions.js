/* empty endpoint means that later on, fetch will try to send
requests to the endpoint it's served from (e.g. localhost:5000) */
let endpoint = '';
// if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
if (process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
}

const getGlobalFilterParameters = state => (
    (state.globalFilters.startDate ? `&start_date=${state.globalFilters.startDate}` : '') +
    (state.globalFilters.endDate ? `&end_date=${state.globalFilters.endDate}` : '')
);

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

