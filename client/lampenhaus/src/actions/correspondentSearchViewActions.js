import { getEndpoint } from '../utils/environment';
import { getGlobalSearchTermFilter } from '../utils/globalFilterParameters';
import handleResponse from '../utils/handleResponse';

const getSearchFieldsString = globalFilter => (
    globalFilter.selectedCorrespondentSearchFields
        .map(field => `&search_field=${field}`)
        .reduce((prev, curr) => prev + curr)
);

export const setShouldFetchData = shouldFetchData => ({
    type: 'SET_SHOULD_FETCH_DATA',
    shouldFetchData,
});

export const submitCorrespondentListRequest = () => ({
    type: 'SUBMIT_CORRESPONDENT_LIST_REQUEST',
});

export const processCorrespondentListResponse = json => ({
    type: 'PROCESS_CORRESPONDENT_LIST_RESPONSE',
    response: json.response,
});

export const processCorrespondentListRequestError = () => ({
    type: 'PROCESS_CORRESPONDENT_LIST_REQUEST_ERROR',
});

export const requestCorrespondentList = (globalFilter, resultsPerPage, pageNumber) => (dispatch, getState) => {
    dispatch(submitCorrespondentListRequest());
    const offset = (pageNumber - 1) * resultsPerPage;

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/search_correspondents?offset=${offset}&limit=${resultsPerPage}` +
        `&dataset=${dataset}${getGlobalSearchTermFilter(globalFilter)}` +
        `${getSearchFieldsString(globalFilter)}` +
        `${globalFilter.exactCorrespondentSearchMatches ? '&match_exact=True' : ''}`)
        .then(handleResponse)
        .then(json => dispatch(processCorrespondentListResponse(json)))
        .catch(() => dispatch(processCorrespondentListRequestError()));
};

