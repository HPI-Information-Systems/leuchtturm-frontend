const search = (state = {
                    activePageNumber: 1,
                },
                action) => {
    switch (action.type) {
        case 'CHANGE_PAGE_NUMBER_TO':
            return {...state, activePageNumber: action.pageNumber};
        default:
            return state;
    }
};

export default search;