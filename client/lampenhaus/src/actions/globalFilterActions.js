import { getEndpoint } from '../utils/environment';
import handleResponse from '../utils/handleResponse';

export const handleGlobalFilterChange = globalFilter => ({
    type: 'HANDLE_GLOBAL_FILTER_CHANGE',
    globalFilter,
});

export const updateSearchTerm = searchTerm => ({
    type: 'UPDATE_SEARCH_TERM',
    searchTerm,
});

export const processTopicsForFiltersResponse = json => ({
    type: 'PROCESS_TOPICS_FOR_FILTER_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processTopicsForFiltersRequestError = () => ({
    type: 'PROCESS_TOPICS_FOR_FILTER_REQUEST_ERROR',
});

export const requestTopicsForFilters = () => (dispatch, getState) => {
    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/filters/topics?dataset=${dataset}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processTopicsForFiltersResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(processTopicsForFiltersRequestError());
        });
};

export const processDateRangeForFiltersResponse = json => ({
    type: 'PROCESS_DATE_RANGE_FOR_FILTER_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processDateRangeForFiltersRequestError = () => ({
    type: 'PROCESS_DATE_RANGE_FOR_FILTER_REQUEST_ERROR',
});

export const requestDateRangeForFilters = () => (dispatch, getState) => {
    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/filters/date_range?dataset=${dataset}`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processDateRangeForFiltersResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(processDateRangeForFiltersRequestError());
        });
};
