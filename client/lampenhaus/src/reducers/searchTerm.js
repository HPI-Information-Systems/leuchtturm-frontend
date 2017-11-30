const searchTerm = (state = '', action) => {
    switch (action.type) {
        case 'UPDATE_SEARCH_TERM':
            console.log('update search term to', action.searchTerm);
            return state = action.searchTerm;
        default:
            return state;
    }
};

export default searchTerm;