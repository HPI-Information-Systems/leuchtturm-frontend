const globalFilter = (
    state = {
        startDate: '',
        endDate: '',
    },
    action,
) => {
    switch (action.type) {
    case 'SET_START_DATE':
        return {
            ...state,
            startDate: action.startDate,
        };
    case 'SET_END_DATE':
        return {
            ...state,
            endDate: action.endDate,
        };
    default:
        return state;
    }
};

export default globalFilter;
