import { getEndpoint } from '../utils/environment';

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

export const requestTopicsForFilters = () => (dispatch, getState) => {
    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/filters/topics?dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with topics information', error),
        ).then(json => dispatch(processTopicsForFiltersResponse(json)));
};

export const processDateRangeForFiltersResponse = json => ({
    type: 'PROCESS_DATE_RANGE_FOR_FILTER_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestDateRangeForFilters = () => (dispatch, getState) => {
    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/filters/date_range?dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with date range information', error),
        ).then(json => dispatch(processDateRangeForFiltersResponse(json)));
};
