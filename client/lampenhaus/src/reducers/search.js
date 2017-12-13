const search = (state = {
                    searchTerm: '',
                    results: [],
                    isFetching: false,
                    hasData: false,
                },
                action) => {
    switch (action.type) {
        case 'UPDATE_SEARCH_TERM':
            return {
                ...state,
                searchTerm: action.searchTerm,
            };
        case 'SUBMIT_SEARCH':
            return {
                ...state,
                isFetching: true,
                results: [],
            };
        case 'RECEIVE_RESULTS':
            return {
                ...state,
                isFetching: false,
                results: action.response,
                hasData: true,
            };
        default:
            return state;
    }
};

export default search;