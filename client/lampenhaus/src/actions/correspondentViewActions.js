import { getEndpoint } from '../utils/environment';
import { getGlobalFilterParameters } from '../utils/globalFilterParameters';
import handleResponse from '../utils/handleResponse';
import { getSortParameter } from './emailListViewActions';

export const setShouldFetchData = shouldFetchData => ({
    type: 'SET_SHOULD_FETCH_DATA',
    shouldFetchData,
});

export const setCorrespondentIdentifyingName = identifyingName => ({
    type: 'SET_CORRESPONDENT_IDENTIFYING_NAME',
    identifyingName,
});

export const submitCorrespondentInfoRequest = () => ({
    type: 'SUBMIT_CORRESPONDENT_INFO_REQUEST',
});

export const processCorrespondentInfoResponse = json => ({
    type: 'PROCESS_CORRESPONDENT_INFO_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processCorrespondentInfoRequestError = () => ({
    type: 'PROCESS_CORRESPONDENT_INFO_REQUEST_ERROR',
});

export const requestCorrespondentInfo = identifyingName => (dispatch, getState) => {
    dispatch(submitCorrespondentInfoRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/correspondent/correspondent_information?` +
        `identifying_name=${identifyingName}&dataset=${dataset}`)
        .then(handleResponse)
        .then(json => dispatch(processCorrespondentInfoResponse(json)))
        .catch(() => dispatch(processCorrespondentInfoRequestError()));
};

export const setCorrespondentListSortation = sortation => ({
    type: 'SET_CORRESPONDENT_LIST_SORTATION',
    sortation,
});

export const submitCorrespondentsForCorrespondentRequest = () => ({
    type: 'SUBMIT_CORRESPONDENTS_FOR_CORRESPONDENT_REQUEST',
});

export const processCorrespondentsForCorrespondentResponse = json => ({
    type: 'PROCESS_CORRESPONDENTS_FOR_CORRESPONDENT_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processCorrespondentsForCorrespondentRequestError = () => ({
    type: 'PROCESS_CORRESPONDENTS_FOR_CORRESPONDENT_REQUEST_ERROR',
});

export const requestCorrespondentsForCorrespondent =
    (identifyingName, globalFilter, sortation) => (dispatch, getState) => {
        dispatch(submitCorrespondentsForCorrespondentRequest());

        const state = getState();
        const dataset = state.datasets.selectedDataset;
        return fetch(`${getEndpoint()}/api/correspondent/correspondents?` +
            `identifying_name=${identifyingName}&dataset=${dataset}` +
            `${getSortParameter(sortation)}` +
            `${getGlobalFilterParameters(globalFilter)}`)
            .then(handleResponse)
            .then(json => dispatch(processCorrespondentsForCorrespondentResponse(json)))
            .catch(() => dispatch(processCorrespondentsForCorrespondentRequestError()));
    };

export const submitSenderRecipientEmailListRequest = () => ({
    type: 'SUBMIT_SENDER_RECIPIENT_EMAIL_LIST_REQUEST',
});

export const processSenderRecipientEmailListResponse = json => ({
    type: 'PROCESS_SENDER_RECIPIENT_EMAIL_LIST_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processSenderRecipientEmailListRequestError = () => ({
    type: 'PROCESS_SENDER_RECIPIENT_EMAIL_LIST_REQUEST_ERROR',
});

export const requestSenderRecipientEmailList = (from, to, globalFilter) => (dispatch, getState) => {
    dispatch(submitSenderRecipientEmailListRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/sender_recipient_email_list?sender=${from}&recipient=${to}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse)
        .then(json => dispatch(processSenderRecipientEmailListResponse(json)))
        .catch(() => dispatch(processSenderRecipientEmailListRequestError()));
};

export const submitTopicsForCorrespondentRequest = () => ({
    type: 'SUBMIT_TOPICS_FOR_CORRESPONDENT_REQUEST',
});

export const processTopicsForCorrespondentResponse = json => ({
    type: 'PROCESS_TOPICS_FOR_CORRESPONDENT_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processTopicsForCorrespondentRequestError = () => ({
    type: 'PROCESS_TOPICS_FOR_CORRESPONDENT_REQUEST_ERROR',
});

export const requestTopicsForCorrespondent = (identifyingName, globalFilter) => (dispatch, getState) => {
    dispatch(submitTopicsForCorrespondentRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/correspondent/topics?identifying_name=${identifyingName}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse)
        .then(json => dispatch(processTopicsForCorrespondentResponse(json)))
        .catch(() => dispatch(processTopicsForCorrespondentRequestError()));
};

export const submitMailboxAllEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_ALL_EMAILS_REQUEST',
});

export const processMailboxAllEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_ALL_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processMailboxAllEmailsRequestError = () => ({
    type: 'PROCESS_MAILBOX_ALL_EMAILS_REQUEST_ERROR',
});

export const requestMailboxAllEmails = (email, globalFilter) => (dispatch, getState) => {
    dispatch(submitMailboxAllEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/sender_recipient_email_list?sender_or_recipient=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse)
        .then(json => dispatch(processMailboxAllEmailsResponse(json)))
        .catch(() => dispatch(processMailboxAllEmailsRequestError()));
};

export const submitMailboxSentEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_SENT_EMAILS_REQUEST',
});

export const processMailboxSentEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_SENT_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processMailboxSentEmailsRequestError = () => ({
    type: 'PROCESS_MAILBOX_SENT_EMAILS_REQUEST_ERROR',
});

export const requestMailboxSentEmails = (email, globalFilter) => (dispatch, getState) => {
    dispatch(submitMailboxSentEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/sender_recipient_email_list?sender=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse)
        .then(json => dispatch(processMailboxSentEmailsResponse(json)))
        .catch(() => dispatch(processMailboxSentEmailsRequestError()));
};

export const submitMailboxReceivedEmailsRequest = () => ({
    type: 'SUBMIT_MAILBOX_RECEIVED_EMAILS_REQUEST',
});

export const processMailboxReceivedEmailsResponse = json => ({
    type: 'PROCESS_MAILBOX_RECEIVED_EMAILS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processMailboxReceivedEmailsRequestError = () => ({
    type: 'PROCESS_MAILBOX_RECEIVED_EMAILS_REQUEST_ERROR',
});

export const requestMailboxReceivedEmails = (email, globalFilter) => (dispatch, getState) => {
    dispatch(submitMailboxReceivedEmailsRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/sender_recipient_email_list?recipient=${email}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse)
        .then(json => dispatch(processMailboxReceivedEmailsResponse(json)))
        .catch(() => dispatch(processMailboxReceivedEmailsRequestError()));
};

export const submitEmailDatesRequest = () => ({
    type: 'SUBMIT_EMAIL_DATES_REQUEST',
});

export const processEmailDatesResponse = json => ({
    type: 'PROCESS_EMAIL_DATES_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processEmailDatesRequestError = () => ({
    type: 'PROCESS_EMAIL_DATES_REQUEST_ERROR',
});

export const requestEmailDates = (identifyingName, globalFilter) => (dispatch, getState) => {
    dispatch(submitEmailDatesRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/correspondent/dates?dataset=${dataset}&identifying_name=${identifyingName}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse)
        .then(json => dispatch(processEmailDatesResponse(json)))
        .catch(() => dispatch(processEmailDatesRequestError()));
};

export const submitClassesForCorrespondentRequest = () => ({
    type: 'SUBMIT_CLASSES_FOR_CORRESPONDENT_REQUEST',
});

export const processClassesForCorrespondentResponse = json => ({
    type: 'PROCESS_CLASSES_FOR_CORRESPONDENT_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processClassesForCorrespondentRequestError = () => ({
    type: 'PROCESS_CLASSES_FOR_CORRESPONDENT_REQUEST_ERROR',
});

export const requestClassesForCorrespondent = (identifyingName, globalFilter) => (dispatch, getState) => {
    dispatch(submitClassesForCorrespondentRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/correspondent/classes?identifying_name=${identifyingName}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse)
        .then(json => dispatch(processClassesForCorrespondentResponse(json)))
        .catch(() => dispatch(processClassesForCorrespondentRequestError()));
};

export const submitKeyphrasesForCorrespondentRequest = () => ({
    type: 'SUBMIT_KEYPHRASES_FOR_CORRESPONDENT_REQUEST',
});

export const processKeyphrasesForCorrespondentResponse = json => ({
    type: 'PROCESS_KEYPHRASES_FOR_CORRESPONDENT_RESPONSE',
    response: json.response,
});

export const processKeyphrasesForCorrespondentRequestError = () => ({
    type: 'PROCESS_KEYPHRASES_FOR_CORRESPONDENT_REQUEST_ERROR',
});

export const requestKeyphrasesForCorrespondent = (identifyingName, globalFilter) => (dispatch, getState) => {
    dispatch(submitKeyphrasesForCorrespondentRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/keyphrases/correspondent?identifying_name=${identifyingName}&dataset=${dataset}`
        + `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse)
        .then(json => dispatch(processKeyphrasesForCorrespondentResponse(json)))
        .catch(() => dispatch(processKeyphrasesForCorrespondentRequestError()));
};
