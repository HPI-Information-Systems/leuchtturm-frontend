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

export const requestGraph = (emailAddresses, neighbours) => (dispatch, getState) => {
    dispatch(submitGraphRequest());
    const emailAddressParams = `${emailAddresses.reduce((prev, curr) => [`${prev}&email_address=${curr}`])}`;

    const state = getState();
    const dataset = state.datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/graph?email_address=${emailAddressParams}` +
        `&neighbours=${neighbours}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with graph information', error),
        ).then(json => dispatch(processGraphResponse(json)));
};
