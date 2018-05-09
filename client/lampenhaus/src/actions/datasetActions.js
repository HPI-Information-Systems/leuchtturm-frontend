import { getEndpoint } from '../utils/environment';

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
    return fetch(`${getEndpoint()}/api/datasets`)
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
