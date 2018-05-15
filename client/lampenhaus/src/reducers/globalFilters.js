const globalFilters = (
    state = {
        topics: [],
        emailClasses: ['business', 'personal', 'spam'],
        filters: {
            searchTerm: '',
            startDate: '',
            endDate: '',
            sender: '',
            recipient: '',
            selectedTopics: [],
            topicThreshold: 0.2,
            selectedEmailClasses: [],
        },
    },
    action,
) => {
    switch (action.type) {
    case 'HANDLE_GLOBAL_FILTERS_CHANGE':
        return {
            ...state,
            filters: {
                ...action.globalFilters,
                selectedTopics: [...action.globalFilters.selectedTopics],
                selectedEmailClasses: [...action.globalFilters.selectedEmailClasses],
            },
        };
    case 'UPDATE_SEARCH_TERM':
        return {
            ...state,
            filters: {
                ...state.filters,
                searchTerm: action.searchTerm,
            },
        };
    case 'PROCESS_TOPICS_FOR_FILTER_RESPONSE':
        return {
            ...state,
            topics: [...action.response],
        };
    default:
        return state;
    }
};

export default globalFilters;
