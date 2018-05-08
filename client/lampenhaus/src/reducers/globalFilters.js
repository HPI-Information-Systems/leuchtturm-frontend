const globalFilters = (
    state = {
        searchTerm: '',
        startDate: '',
        endDate: '',
        sender: '',
        recipient: '',
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
            selectedTopics: [...action.globalFilters.selectedTopics],
            selectedEmailClasses: [...action.globalFilters.selectedEmailClasses],
        };
    case 'UPDATE_SEARCH_TERM':
        return {
            ...state,
            searchTerm: action.searchTerm,
        };
    default:
        return state;
    }
};

export default globalFilters;
