export const updateSearchTerm = searchTerm => {
  return {
    type: 'UPDATE_SEARCH_TERM',
    searchTerm
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

export const submitSearch = () => {
  return {
    type: 'SUBMIT_SEARCH',
  }
};