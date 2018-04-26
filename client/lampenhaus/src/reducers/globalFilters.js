const globalFilters = (
    state = {
        searchTerm: '',
        startDate: '',
        endDate: '',
        selectedTopics: [],
        selectedEmailClasses: [],
    },
    action,
) => {
    switch (action.type) {
    case 'HANDLE_GLOBAL_FILTERS_CHANGE':
        return {
            ...state,
            ...action.globalFilters,
        };
    // case 'UPDATE_SEARCH_TERM':
    //    return {
    //        ...state,
    //    };
    default:
        return state;
    }
};

export default globalFilters;
