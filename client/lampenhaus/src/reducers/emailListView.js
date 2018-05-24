const emailListView = (
    state = {
        emailList: {
            isFetching: false,
            hasRequestError: false,
            results: [],
            number: 0,
            sortation: '',
        },
        emailListCorrespondents: {
            isFetching: false,
            hasRequestError: false,
            results: [],
        },
        emailListDates: {
            isFetching: false,
            hasRequestError: false,
            results: [],
        },
    },
    action,
) => {
    switch (action.type) {
    case 'SET_SORTATION':
        return {
            ...state,
            emailList: {
                ...state.emailList,
                sortation: action.sortation,
            },
        };
    case 'SUBMIT_EMAIL_LIST_REQUEST':
        return {
            ...state,
            emailList: {
                ...state.emailList,
                isFetching: true,
                hasRequestError: false,
                results: [],
                number: 0,
            },
        };
    case 'PROCESS_EMAIL_LIST_RESPONSE':
        return {
            ...state,
            emailList: {
                ...state.emailList,
                isFetching: false,
                results: action.response.results,
                number: action.response.numFound,
            },
        };
    case 'PROCESS_EMAIL_LIST_REQUEST_ERROR':
        return {
            ...state,
            emailList: {
                ...state.emailList,
                isFetching: false,
                hasRequestError: true,
            },
        };
    case 'SUBMIT_EMAIL_LIST_CORRESPONDENTS_REQUEST':
        return {
            ...state,
            emailListCorrespondents: {
                ...state.emailListCorrespondents,
                isFetching: true,
                hasRequestError: false,
                results: [],
            },
        };
    case 'PROCESS_EMAIL_LIST_CORRESPONDENTS_RESPONSE':
        return {
            ...state,
            emailListCorrespondents: {
                ...state.emailListCorrespondents,
                isFetching: false,
                results: action.response.correspondents,
            },
        };
    case 'PROCESS_EMAIL_LIST_CORRESPONDENTS_REQUEST_ERROR':
        return {
            ...state,
            emailListCorrespondents: {
                ...state.emailList,
                isFetching: false,
                hasRequestError: true,
            },
        };
    case 'SUBMIT_EMAIL_LIST_DATES_REQUEST':
        return {
            ...state,
            emailListDates: {
                ...state.emailListDates,
                isFetching: true,
                hasRequestError: false,
                results: [],
            },
        };
    case 'PROCESS_EMAIL_LIST_DATES_RESPONSE':
        return {
            ...state,
            emailListDates: {
                ...state.emailListDates,
                isFetching: false,
                results: action.response,
            },
        };
    case 'PROCESS_EMAIL_LIST_DATES_REQUEST_ERROR':
        return {
            ...state,
            emailListDates: {
                ...state.emailList,
                isFetching: false,
                hasRequestError: true,
            },
        };
    default:
        return state;
    }
};

export default emailListView;
