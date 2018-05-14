import { getEndpoint } from '../utils/environment';
import getGlobalFilterParameters from '../utils/globalFilterParameters';

const getSortParameter = sort => (
    sort ? `&sort=${sort}` : ''
);

export const submitEmailListSearch = searchTerm => ({
    type: 'SUBMIT_EMAIL_LIST_SEARCH',
    searchTerm,
});

export const processEmailListResults = json => ({
    type: 'PROCESS_EMAIL_LIST_RESULTS',
    response: json.response,
});

export const changePageNumberTo = pageNumber => ({
    type: 'CHANGE_PAGE_NUMBER_TO',
    pageNumber,
});

export const requestEmailList = (globalFilters, resultsPerPage, pageNumber) => (dispatch, getState) => {
    dispatch(changePageNumberTo(pageNumber));
    dispatch(submitEmailListSearch(globalFilters.searchTerm));

    const offset = (pageNumber - 1) * resultsPerPage;

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/search?&offset=${offset}&limit=${resultsPerPage}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilters)}` +
        `${getSortParameter(state.sort)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(processEmailListResults(json)));
};

export const submitEmailListDatesRequest = () => ({
    type: 'SUBMIT_EMAIL_LIST_DATES_REQUEST',
});

export const processEmailListDatesResponse = json => ({
    type: 'PROCESS_EMAIL_LIST_DATES_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestEmailListDates = globalFilters => (dispatch, getState) => {
    dispatch(submitEmailListDatesRequest());

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/term/dates?dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilters)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with topic information', error),
        ).then(json => dispatch(processEmailListDatesResponse(json)));
};

export const submitCorrespondentSearch = searchTerm => ({
    type: 'SUBMIT_CORRESPONDENT_SEARCH',
    searchTerm,
});

export const processCorrespondentResults = json => ({
    type: 'PROCESS_CORRESPONDENT_RESULTS',
    response: json.response,
});

export const requestCorrespondentResult = globalFilters => (dispatch, getState) => {
    dispatch(submitCorrespondentSearch(globalFilters.searchTerm));

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/term/correspondents?dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilters)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred.', error),
        ).then(json => dispatch(processCorrespondentResults(json)));
};
