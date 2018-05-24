import { getEndpoint } from '../utils/environment';
import getGlobalFilterParameters from '../utils/globalFilterParameters';
import handleResponse from '../utils/handleResponse';

export const submitGraphRequest = () => ({
    type: 'SUBMIT_GRAPH_REQUEST',
});

export const processGraphResponse = json => ({
    type: 'PROCESS_GRAPH_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processGraphRequestError = () => ({
    type: 'PROCESS_GRAPH_REQUEST_ERROR',
});

export const requestGraph = (identifyingNames, isCorrespondentView, globalFilter) => (dispatch, getState) => {
    dispatch(submitGraphRequest());
    const identifyingNamesParams = `${identifyingNames.reduce((prev, curr) => [`${prev}&identifying_name=${curr}`])}`;

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/graph?identifying_name=${identifyingNamesParams}` +
        `&is_correspondent_view=${isCorrespondentView}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(handleResponse, () => dispatch(processGraphRequestError()))
        .then(json => dispatch(processGraphResponse(json)))
        .catch(() => dispatch(processGraphRequestError()));
};
