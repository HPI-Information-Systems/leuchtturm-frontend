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
        response: json.response,
    }
};

export const fetchResults = searchTerm => {

    return dispatch => {

        dispatch(submitSearch(searchTerm));
        // TODO: remove hardcoded host
        return fetch('http://b9448.byod.hpi.de:5000/api/search?search_term=' + searchTerm + '&offset=4')
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