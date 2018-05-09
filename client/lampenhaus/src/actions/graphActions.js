/* empty endpoint means that later on, fetch will try to send
requests to the endpoint it's served from (e.g. localhost:5000) */
let endpoint = '';
// if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
if (process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
}

const getGlobalFilterParameters = state => (
    (state.globalFilters.startDate ? `&start_date=${state.globalFilters.startDate}` : '') +
    (state.globalFilters.endDate ? `&end_date=${state.globalFilters.endDate}` : '')
);

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
    return fetch(`${endpoint}/api/graph?email_address=${emailAddressParams}` +
        `&neighbours=${neighbours}&dataset=${dataset}` +
        `${getGlobalFilterParameters(state)}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with graph information', error),
        ).then(json => dispatch(processGraphResponse(json)));
};
