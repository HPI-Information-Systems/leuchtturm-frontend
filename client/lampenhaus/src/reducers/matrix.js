const matrix = (
    state = {
        isFetchingMatrix: false,
        hasMatrixData: false,
        hasMatrixRequestError: false,
        matrix: {
            nodes: [],
            links: [],
        },
        combinedSorting: false,
        selectedOrder: 'community',
        selectedFirstOrder: 'community',
        selectedSecondOrder: 'role',
        selectedColorOption: 'community',
    },
    action,
) => {
    switch (action.type) {
    case 'SUBMIT_MATRIX_REQUEST':
        return {
            ...state,
            isFetchingMatrix: true,
            hasMatrixData: false,
            hasMatrixRequestError: false,
            matrix: {
                nodes: [],
                links: [],
            },
        };
    case 'PROCESS_MATRIX_RESPONSE': {
        return {
            ...state,
            isFetchingMatrix: false,
            hasMatrixData: true,
            matrix: action.response,
        };
    }
    case 'PROCESS_MATRIX_REQUEST_ERROR': {
        return {
            ...state,
            isFetchingMatrix: false,
            hasMatrixRequestError: true,
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
    case 'SET_SELECTED_COLOR_OPTION':
        return {
            ...state,
            selectedColorOption: action.selectedColorOption,
        };
    default:
        return state;
    }
};

export default matrix;
