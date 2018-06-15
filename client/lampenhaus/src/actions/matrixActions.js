import { getEndpoint } from '../utils/environment';
import handleResponse from '../utils/handleResponse';

export const submitMatrixRequest = () => ({
    type: 'SUBMIT_MATRIX_REQUEST',
});

export const processMatrixResponse = json => ({
    type: 'PROCESS_MATRIX_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const processMatrixRequestError = () => ({
    type: 'PROCESS_MATRIX_REQUEST_ERROR',
});

export const requestMatrix = () => (dispatch, getState) => {
    dispatch(submitMatrixRequest());

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/matrix/full?dataset=${dataset}`)
        .then(handleResponse)
        .then(json => dispatch(processMatrixResponse(json)))
        .catch(() => dispatch(processMatrixRequestError()));
};

export const setCombinedSorting = combinedSorting => ({
    type: 'SET_COMBINED_SORTING',
    combinedSorting,
});

export const setSelectedOrder = selectedOrder => ({
    type: 'SET_SELECTED_ORDER',
    selectedOrder,
});

export const setSelectedFirstOrder = selectedFirstOrder => ({
    type: 'SET_SELECTED_FIRST_ORDER',
    selectedFirstOrder,
});

export const setSelectedSecondOrder = selectedSecondOrder => ({
    type: 'SET_SELECTED_SECOND_ORDER',
    selectedSecondOrder,
});

export const setSelectedColorOption = selectedColorOption => ({
    type: 'SET_SELECTED_COLOR_OPTION',
    selectedColorOption,
});
