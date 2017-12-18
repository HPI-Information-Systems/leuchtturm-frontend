// empty endpoint means that later on, fetch will try to send requests to the endpoint it's served from (e.g. localhost:5000)
let endpoint = ''
// if application is currently running with 'npm start' on port 3000, we need to specifically access Flask on :5000
if(process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:5000';
}

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
        return fetch(`${endpoint}/api/search?search_term=${searchTerm}&offset=4`)
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