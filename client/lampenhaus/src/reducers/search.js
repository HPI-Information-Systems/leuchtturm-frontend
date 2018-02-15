const search = (
    state = {
        searchTerm: '',
        activeSearchTerm: '',
        results: [],
        numberOfResults: 0,
        activePageNumber: 1,
        resultsPerPage: 10,
        isFetching: false,
        hasData: false,
    },
    action,
) => {
    switch (action.type) {
    case 'UPDATE_SEARCH_TERM':
        return {
            ...state,
            searchTerm: action.searchTerm,
        };
    case 'SUBMIT_SEARCH':
        return {
            ...state,
            activeSearchTerm: action.searchTerm,
            isFetching: true,
            hasData: false,
            results: [],
        };
    case 'RECEIVE_RESULTS':
        return {
            ...state,
            results: action.response.results,
            numberOfResults: action.response.numFound,
            isFetching: false,
            hasData: true,
        };
    case 'CHANGE_PAGE_NUMBER_TO':
        return {
            ...state,
            activePageNumber: action.pageNumber,
        };
    default:
        return state;
    }
};

export default search;
