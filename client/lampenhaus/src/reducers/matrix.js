const matrix = (
    state = {
        combinedSorting: false,
        selectedOrder: 'community',
        selectedFirstOrder: 'community',
        selectedSecondOrder: 'role',
        selectedColorOption: 'community',
    },
    action,
) => {
    switch (action.type) {
    case 'SET_COMBINED_SORTING':
        return {
            ...state,
            combinedSorting: action.combinedSorting,
        };
    case 'SET_SELECTED_ORDER':
        return {
            ...state,
            selectedOrder: action.selectedOrder,
        };
    case 'SET_SELECTED_FIRST_ORDER':
        return {
            ...state,
            selectedFirstOrder: action.selectedFirstOrder,
        };
    case 'SET_SELECTED_SECOND_ORDER':
        return {
            ...state,
            selectedSecondOrder: action.selectedSecondOrder,
        };
    case 'SET_SELECTED_COLOR_OPTION':
        return {
            ...state,
            selectedColorOption: action.selectedColorOption,
        };
    default:
        return state;
    }
};

export default matrix;
