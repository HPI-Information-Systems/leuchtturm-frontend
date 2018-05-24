import { getEndpoint } from '../utils/environment';
import getGlobalFilterParameters from '../utils/globalFilterParameters';
import handleResponse from '../utils/handleResponse';

export const setCorrespondentIdentifyingName = identifyingName => ({
    type: 'SET_CORRESPONDENT_IDENTIFYING_NAME',
    identifyingName,
});

export const submitCorrespondentRequest = () => ({
    type: 'SUBMIT_CORRESPONDENT_REQUEST',
});

export const processCorrespondentsResponse = json => ({
    type: 'PROCESS_CORRESPONDENTS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestCorrespondents = (identifyingName, globalFilter) => (dispatch, getState) => {
    dispatch(submitCorrespondentRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/correspondent/correspondents?` +
        `identifying_name=${identifyingName}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processCorrespondentsResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting the correspondents.'));
        });
};

export const submitTermRequest = () => ({
    type: 'SUBMIT_TERM_REQUEST',
});

export const processTermsResponse = json => ({
    type: 'PROCESS_TERMS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestTerms = (identifyingName, globalFilter) => (dispatch, getState) => {
    dispatch(submitTermRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/correspondent/terms?identifying_name=${identifyingName}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processTermsResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting the terms.'));
        });
};


export const submitSenderRecipientEmailListRequest = () => ({
    type: 'SUBMIT_SENDER_RECIPIENT_EMAIL_LIST_REQUEST',
});

export const processSenderRecipientEmailListResponse = json => ({
    type: 'PROCESS_SENDER_RECIPIENT_EMAIL_LIST_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestSenderRecipientEmailList = (from, to, globalFilter) => (dispatch, getState) => {
    dispatch(submitSenderRecipientEmailListRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/sender_recipient_email_list?sender=${from}&recipient=${to}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processSenderRecipientEmailListResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting the sender/recipient list.'));
        });
};

export const submitTopicsForCorrespondentRequest = () => ({
    type: 'SUBMIT_TOPICS_FOR_CORRESPONDENT_REQUEST',
});

export const processTopicsForCorrespondentResponse = json => ({
    type: 'PROCESS_TOPICS_FOR_CORRESPONDENT_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestTopicsForCorrespondent = (identifyingName, globalFilter) => (dispatch, getState) => {
    dispatch(submitTopicsForCorrespondentRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/correspondent/topics?identifying_name=${identifyingName}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processTopicsForCorrespondentResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting the topics.'));
        });
};

export const submitMailboxAllEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_ALL_EMAILS_REQUEST',
});

export const processMailboxAllEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_ALL_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMailboxAllEmails = (email, globalFilter) => (dispatch, getState) => {
    dispatch(submitMailboxAllEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/sender_recipient_email_list?sender_or_recipient=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processMailboxAllEmailsResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting all emails.'));
        });
};

export const submitMailboxSentEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_SENT_EMAILS_REQUEST',
});

export const processMailboxSentEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_SENT_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMailboxSentEmails = (email, globalFilter) => (dispatch, getState) => {
    dispatch(submitMailboxSentEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/sender_recipient_email_list?sender=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processMailboxSentEmailsResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting sent emails.'));
        });
};

export const submitMailboxReceivedEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_RECEIVED_EMAILS_REQUEST',
});

export const processMailboxReceivedEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_RECEIVED_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMailboxReceivedEmails = (email, globalFilter) => (dispatch, getState) => {
    dispatch(submitMailboxReceivedEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/sender_recipient_email_list?recipient=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processMailboxReceivedEmailsResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(addErrorMessage('An error occurred while requesting received emails.'));
        });
};

