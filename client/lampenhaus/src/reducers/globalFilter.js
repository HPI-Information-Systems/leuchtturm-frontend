import getStandardGlobalFilter from '../utils/getStandardGlobalFilter';

const globalFilter = (
    state = {
        dateRange: {
            startDate: '',
            endDate: '',
        },
        topics: [],
        emailClasses: ['business', 'personal', 'spam'],
        filters: getStandardGlobalFilter(),
    },
    action,
) => {
    switch (action.type) {
    case 'HANDLE_GLOBAL_FILTER_CHANGE':
        return {
            ...state,
            filters: {
                ...action.globalFilter,
                selectedTopics: [...action.globalFilter.selectedTopics],
                selectedEmailClasses: [...action.globalFilter.selectedEmailClasses],
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
    case 'PROCESS_DATE_RANGE_FOR_FILTER_RESPONSE':
        return {
            ...state,
            dateRange: {
                startDate: action.response.startDate,
                endDate: action.response.endDate,
            },
        };
    default:
        return state;
    }
};

export default globalFilter;
