const search = (state = {
                    searchTerm: '',
                    results: [],
                    numberOfResults: 0,
                    offset: 0,
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
        case 'REQUEST_PAGE':
            return {
                ...state,
                activePageNumber: action.pageNumber
            };
        case 'RECEIVE_RESULTS':
            return {
                ...state,
                results: action.response.results,
                numberOfResults: action.response.numFound,
                isFetching: false,
                hasData: true,
            };
        default:
            return state;
    }
};

export default search;