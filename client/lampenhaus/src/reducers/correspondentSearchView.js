const correspondentSearchView = (
    state = {
        shouldFetchData: false,
        correspondentList: {
            isFetching: false,
            hasRequestError: false,
            results: [],
            number: 0,
        },
    },
    action,
) => {
    switch (action.type) {
    case 'SET_SHOULD_FETCH_DATA':
    return {
        ...state,
        shouldFetchData: action.shouldFetchData,
    };
    case 'SUBMIT_CORRESPONDENT_LIST_REQUEST':
        return {
            ...state,
            correspondentList: {
                ...state.correspondentList,
                isFetching: true,
                hasRequestError: false,
                results: [],
                number: 0,
            },
        };
    case 'PROCESS_CORRESPONDENT_LIST_RESPONSE':
        return {
            ...state,
            correspondentList: {
                ...state.correspondentList,
                isFetching: false,
                results: action.response.results,
                number: action.response.numFound,
            },
        };
    case 'PROCESS_CORRESPONDENT_LIST_REQUEST_ERROR':
        return {
            ...state,
            correspondentList: {
                ...state.correspondentList,
                isFetching: false,
                hasRequestError: true,
            },
        };
    default:
        return state;
    }
};

export default correspondentSearchView;
