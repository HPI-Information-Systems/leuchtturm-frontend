const search = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH_TERM':
      return [
        ...state,
        {
          searchInput: action.searchInput,
        }
      ]
    default:
      return state;
  }
}

export default search