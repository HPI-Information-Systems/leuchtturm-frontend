/* empty endpoint means that later on, fetch will try to send
requests to the endpoint it's served from (e.g. localhost:5000) */
let endpoint = '';
// if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
if (process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
}

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
