import { getEndpoint } from '../utils/environment';
import handleResponse from '../utils/handleResponse';

export const submitDatasetsRequest = () => ({
    type: 'SUBMIT_DATASETS_REQUEST',
});

export const processDatasetsResponse = json => ({
    type: 'PROCESS_DATASETS_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processDatasetsRequestError = () => ({
    type: 'PROCESS_DATASETS_REQUEST_ERROR',
});

export const requestDatasets = () => (dispatch) => {
    dispatch(submitDatasetsRequest());
    return fetch(`${getEndpoint()}/api/datasets`)
        // eslint-disable-next-line no-console
        .then(handleResponse, console.error)
        .then(json => dispatch(processDatasetsResponse(json)))
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            dispatch(processDatasetsRequestError());
        });
};

export const setSelectedDataset = selectedDataset => ({
    type: 'SET_SELECTED_DATASET',
    dataset: selectedDataset,
});
