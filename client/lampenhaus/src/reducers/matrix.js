const matrix = (
    state = {
        isFetchingMatrix: false,
        hasMatrixData: false,
        matrix: {
            nodes: [],
            links: [],
        },
        isFetchingHighlightingMatrix: false,
        hasMatrixHighlightingData: false,
        matrixHighlighting: {
            nodes: [],
            links: [],
        },
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
    case 'SUBMIT_MATRIX_HIGHLIGHTING_REQUEST':
        return {
            ...state,
            isFetchingMatrixHighlighting: true,
            hasMatrixHighlightingData: false,
            matrixHighlighting: {
                nodes: [],
                links: [],
            },
        };
    case 'PROCESS_MATRIX_HIGHLIGHTING_RESPONSE': {
        let hasMatrixHighlightingData = true;
        if (action.response === 'Error') {
            hasMatrixHighlightingData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            isFetchingMatrixHighlighting: false,
            hasMatrixHighlightingData,
            matrixHighlighting: action.response,
        };
    }
    default:
        return state;
    }
};

export default matrix;
