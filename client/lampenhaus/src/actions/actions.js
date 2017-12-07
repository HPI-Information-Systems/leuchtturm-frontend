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

export const increment = () => {
    return {
        type: 'INCREMENT',
    }
};

export const decrement = () => {
    return {
        type: 'DECREMENT',
    }
};

export const fetchResults = searchTerm => {

  return dispatch => {

    dispatch(submitSearch(searchTerm));

    return fetch(`http://localhost:5000/api/search/mock?count=5`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json => {console.log(json); dispatch(receiveResults(json)); }
      )
  }
};