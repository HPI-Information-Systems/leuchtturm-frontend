import { getEndpoint } from '../utils/environment';
import handleResponse from '../utils/handleResponse';

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

export const processEmailRequestError = () => ({
    type: 'PROCESS_EMAIL_REQUEST_ERROR',
});

export const requestEmail = docId => (dispatch, getState) => {
    dispatch(submitEmailRequest());

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/email?doc_id=${docId}&dataset=${dataset}`)
        .then(handleResponse, () => dispatch(processEmailRequestError()))
        .then(json => dispatch(processEmailResponse(json)))
        .catch(() => dispatch(processEmailRequestError()));
};

export const submitSimilarEmailsRequest = () => ({
    type: 'SUBMIT_SIMILAR_EMAILS_REQUEST',
});

export const processSimilarEmailsResponse = json => ({
    type: 'PROCESS_SIMILAR_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processSimilarEmailsRequestError = () => ({
    type: 'PROCESS_SIMILAR_EMAILS_REQUEST_ERROR',
});

export const requestSimilarEmails = docId => (dispatch, getState) => {
    dispatch(submitSimilarEmailsRequest());

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/email/similar?doc_id=${docId}&dataset=${dataset}`)
        .then(handleResponse, () => dispatch(processSimilarEmailsRequestError()))
        .then(json => dispatch(processSimilarEmailsResponse(json)))
        .catch(() => dispatch(processSimilarEmailsRequestError()));
};

export const setBodyType = type => ({
    type: `SET_BODY_TYPE_${type.toUpperCase()}`,
});
