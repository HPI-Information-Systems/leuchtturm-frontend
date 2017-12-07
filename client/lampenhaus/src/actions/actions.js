export const updateSearchTerm = searchTerm => {
    return {
        type: 'UPDATE_SEARCH_TERM',
        searchTerm
    }
};

export const submitSearch = () => {
    return {
        type: 'SUBMIT_SEARCH',
    }
};

export const receiveResults = (json) =>  {
    return {
        type: 'RECEIVE_RESULTS',
        results: json.response.results,
    }
};

export const fetchResults = searchTerm => {

    return dispatch => {

        dispatch(submitSearch(searchTerm));

        return fetch('http://localhost:5000/api/search/mock?count=' + searchTerm)
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => dispatch(receiveResults(json)))
    }
};

export const changePageNumberTo = pageNumber => {
    return {
        type: 'CHANGE_PAGE_NUMBER_TO',
        pageNumber,
    }
};