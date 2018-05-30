const matrix = (
    state = {
        isFetchingMatrix: false,
        hasMatrixData: false,
        matrix: {
            nodes: [],
            links: [],
        },
        combinedSorting: false,
        selectedOrder: 'community',
        selectedFirstOrder: 'community',
        selectedSecondOrder: 'address',
    },
    action,
) => {
    switch (action.type) {
    case 'SUBMIT_MATRIX_REQUEST':
        return {
            ...state,
            isFetchingMatrix: true,
            hasMatrixData: false,
            matrix: {
                nodes: [],
                links: [],
            },
        };
    case 'PROCESS_MATRIX_RESPONSE': {
        let hasMatrixData = true;
        if (action.response === 'Error') {
            hasMatrixData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            isFetchingMatrix: false,
            hasMatrixData,
            matrix: action.response,
        };
    }
    case 'SET_COMBINED_SORTING':
        return {
            ...state,
            combinedSorting: action.combinedSorting,
        };
    case 'SET_SELECTED_ORDER':
        return {
            ...state,
            selectedOrder: action.selectedOrder,
        };
    case 'SET_SELECTED_FIRST_ORDER':
        return {
            ...state,
            selectedFirstOrder: action.selectedFirstOrder,
        };
    case 'SET_SELECTED_SECOND_ORDER':
        return {
            ...state,
            selectedSecondOrder: action.selectedSecondOrder,
        };
    default:
        return state;
    }
};

export default matrix;
