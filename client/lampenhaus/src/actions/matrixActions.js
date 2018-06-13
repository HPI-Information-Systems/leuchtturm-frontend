import { getEndpoint } from '../utils/environment';

export const submitMatrixRequest = () => ({
    type: 'SUBMIT_MATRIX_REQUEST',
});

export const processMatrixResponse = json => ({
    type: 'PROCESS_MATRIX_RESPONSE',
    response: json.response,
    responseHeader: json.responseHeader,
});

export const requestMatrix = () => (dispatch, getState) => {
    dispatch(submitMatrixRequest());

    const dataset = getState().datasets.selectedDataset;
    return fetch(`${getEndpoint()}/api/matrix/full?dataset=${dataset}`)
        .then(
            response => response.json(),
            // eslint-disable-next-line no-console
            error => console.error('An error occurred while parsing response with matrix information', error),
        ).then(json => dispatch(processMatrixResponse(json)));
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
