const search = (state = {
                    searchTerm: '',
                    resultList: [],
                    isFetching: false,
                    hasData: false,
                },
                action) => {
    switch (action.type) {
        case 'UPDATE_SEARCH_TERM':
            return state = {searchTerm: action.searchTerm};
        case 'SUBMIT_SEARCH':
            return state = {isFetching: true};
        case 'RECEIVE_RESULTS':
            return state = {
                isFetching: false,
                resultList: action.results,
                hasData: true,
            };
        default:
            return state;
    }
};

export default search;