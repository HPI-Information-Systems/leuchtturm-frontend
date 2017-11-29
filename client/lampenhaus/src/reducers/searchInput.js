const searchInput = (state = '', action) => {
    switch (action.type) {
        case 'UPDATE_SEARCH_TERM':
            return state = action.searchInput;
        default:
            return state;
    }
};

export default searchInput;