import { getEndpoint } from '../utils/environment';
import getGlobalFilterParameters from '../utils/globalFilterParameters';
import handleResponse from '../utils/handleResponse';

const getSortParameter = sortation => (
    sortation ? `&sort=${sortation}` : ''
);

export const setSortation = sortation => ({
    type: 'SET_SORTATION',
    sortation,
});

export const submitEmailListRequest = () => ({
    type: 'SUBMIT_EMAIL_LIST_REQUEST',
});

export const processEmailListResponse = json => ({
    type: 'PROCESS_EMAIL_LIST_RESPONSE',
    response: json.response,
});

export const processEmailListRequestError = () => ({
    type: 'PROCESS_EMAIL_LIST_REQUEST_ERROR',
});

export const requestEmailList = (globalFilter, resultsPerPage, pageNumber, sortation) => (dispatch, getState) => {
    dispatch(submitEmailListRequest(globalFilter.searchTerm));

    const offset = (pageNumber - 1) * resultsPerPage;

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/search?&offset=${offset}&limit=${resultsPerPage}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}` +
        `${getSortParameter(sortation)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processEmailListResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(processEmailListRequestError());
        });
};

export const submitEmailListDatesRequest = () => ({
    type: 'SUBMIT_EMAIL_LIST_DATES_REQUEST',
});

export const processEmailListDatesResponse = json => ({
    type: 'PROCESS_EMAIL_LIST_DATES_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processEmailListDatesRequestError = () => ({
    type: 'PROCESS_EMAIL_LIST_DATES_REQUEST_ERROR',
});

export const requestEmailListDates = globalFilter => (dispatch, getState) => {
    dispatch(submitEmailListDatesRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/term/dates?dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processEmailListDatesResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(processEmailListDatesRequestError());
        });
};

export const submitEmailListCorrespondentsRequest = () => ({
    type: 'SUBMIT_EMAIL_LIST_CORRESPONDENTS_REQUEST',
});

export const processEmailListCorrespondentsResponse = json => ({
    type: 'PROCESS_EMAIL_LIST_CORRESPONDENTS_RESPONSE',
    response: json.response,
});

export const processEmailListCorrespondentsRequestError = () => ({
    type: 'PROCESS_EMAIL_LIST_CORRESPONDENTS_REQUEST_ERROR',
});

export const requestCorrespondentResult = globalFilter => (dispatch, getState) => {
    dispatch(submitEmailListCorrespondentsRequest(globalFilter.searchTerm));

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/term/correspondents?dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processEmailListCorrespondentsResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(processEmailListCorrespondentsRequestError());
        });
};
