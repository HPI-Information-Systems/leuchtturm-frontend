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

export const requestEmail = docId => (dispatch, getState) => {
    dispatch(submitEmailRequest());

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/email?doc_id=${docId}&dataset=${dataset}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processEmailResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting the email.'));
        });
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
    return fetch(`${getEndpoint()}/api/email/similar?doc_id=${docId}&dataset=${dataset}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processSimilarEmailsResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting similar emails.'));
        });
};

export const setBodyType = type => ({
    type: `SET_BODY_TYPE_${type.toUpperCase()}`,
});
