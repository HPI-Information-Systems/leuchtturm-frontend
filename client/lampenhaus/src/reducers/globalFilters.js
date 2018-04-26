const globalFilters = (
    state = {
        searchTerm: '',
        startDate: '',
        endDate: '',
        selectedTopics: [],
        selectedClasses: [],
    },
    action,
) => {
    switch (action.type) {
    case 'HANDLE_GLOBAL_FILTERS_CHANGE':
        return {
            ...state,
            ...action.globalFilters,
        };
    default:
        return state;
    }
};

export default globalFilters;
