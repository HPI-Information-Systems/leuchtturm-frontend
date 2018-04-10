const globalFilter = (
    state = {
        startDate: null,
        endDate: null,
    },
    action,
) => {
    switch (action.type) {
    case 'SET_START_DATE':
        return {
            ...state,
            startDate: action.startDate === '' ? null : action.startDate,
        };
    case 'SET_END_DATE':
        return {
            ...state,
            endDate: action.endDate === '' ? null : action.endDate,
        };
    default:
        return state;
    }
};

export default globalFilter;
