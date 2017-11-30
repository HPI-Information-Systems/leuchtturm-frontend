const searchTerm = (state = '', action) => {
    switch (action.type) {
        case 'UPDATE_SEARCH_TERM':
            return state = action.searchTerm;
        default:
            return state;
    }
};

export default searchTerm;