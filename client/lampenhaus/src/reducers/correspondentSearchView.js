const correspondentSearchView = (
    state = {
        shouldFetchData: true,
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
                results: action.response.correspondents,
                number: 0, // TODO: enter real number here...
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
