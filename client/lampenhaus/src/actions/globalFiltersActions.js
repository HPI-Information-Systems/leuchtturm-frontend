import { getEndpoint } from '../utils/environment';

export const handleGlobalFiltersChange = globalFilters => ({
    type: 'HANDLE_GLOBAL_FILTERS_CHANGE',
    globalFilters,
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
