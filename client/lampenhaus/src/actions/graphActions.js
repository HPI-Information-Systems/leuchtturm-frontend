import { getEndpoint } from '../utils/environment';
import getGlobalFilterParameters from '../utils/globalFilterParameters';

export const submitGraphRequest = () => ({
    type: 'SUBMIT_GRAPH_REQUEST',
});

export const processGraphResponse = json => ({
    type: 'PROCESS_GRAPH_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestGraph = (identifyingNames, isCorrespondentView, globalFilter) => (dispatch, getState) => {
    dispatch(submitGraphRequest());
    const identifyingNamesParams = `${identifyingNames.reduce((prev, curr) => [`${prev}&identifying_name=${curr}`])}`;

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/graph?identifying_name=${identifyingNamesParams}` +
        `&is_correspondent_view=${isCorrespondentView}&dataset=${dataset}` +
        `${getGlobalFilterParameters(globalFilter)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with graph information', error),
        ).then(json => dispatch(processGraphResponse(json)));
};
