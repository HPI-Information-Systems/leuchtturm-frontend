/* empty endpoint means that later on, fetch will try to send
requests to the endpoint it's served from (e.g. localhost:5000) */
let endpoint = '';
// if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
if (process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
}

export const submitDatasetsRequest = () => ({
    type: 'SUBMIT_DATASETS_REQUEST',
});

export const processDatasetsResponse = json => ({
    type: 'PROCESS_DATASETS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestDatasets = () => (dispatch) => {
    dispatch(submitDatasetsRequest());
    return fetch(`${endpoint}/api/datasets`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with dataset information', error),
        ).then(json => dispatch(processDatasetsResponse(json)));
};

export const setSelectedDataset = selectedDataset => ({
    type: 'SET_SELECTED_DATASET',
    dataset: selectedDataset,
});
