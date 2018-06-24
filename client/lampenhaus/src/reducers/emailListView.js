const emailListView = (
    state = {
        shouldFetchData: false,
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
            sortation: '',
        },
        emailListDates: {
            isFetching: false,
            hasRequestError: false,
            results: {},
            hasData: false,
        },
        matrixHighlighting: {
            isFetching: false,
            hasRequestError: false,
            results: [],
            hasData: false,
        },
        topicsForEmailList: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            results: {},
        },
    },
    action,
) => {
    switch (action.type) {
    case 'SET_SHOULD_FETCH_DATA':
        return {
            ...state,
            shouldFetchData: action.shouldFetchData,
        };
    case 'SET_EMAIL_LIST_SORTATION':
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
            topicsForEmailList: {
                ...state.topicsForEmailList,
                isFetching: true,
                hasData: false,
                hasRequestError: false,
                results: {},
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
            topicsForEmailList: {
                ...state.topicsForEmailList,
                isFetching: false,
                hasData: true,
                results: action.response.searchTopics,
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
            topicsForEmailList: {
                ...state.topicsForEmailList,
                isFetching: false,
                hasRequestError: true,
            },
        };
    case 'SET_CORRESPONDENT_LIST_SORTATION':
        return {
            ...state,
            emailListCorrespondents: {
                ...state.emailListCorrespondents,
                sortation: action.sortation,
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
                ...state.emailListCorrespondents,
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
                results: {},
                hasData: false,
            },
        };
    case 'PROCESS_EMAIL_LIST_DATES_RESPONSE':
        return {
            ...state,
            emailListDates: {
                ...state.emailListDates,
                isFetching: false,
                results: action.response,
                hasData: true,
            },
        };
    case 'PROCESS_EMAIL_LIST_DATES_REQUEST_ERROR':
        return {
            ...state,
            emailListDates: {
                ...state.emailListDates,
                isFetching: false,
                hasRequestError: true,
            },
        };
    case 'SUBMIT_MATRIX_HIGHLIGHTING_REQUEST':
        return {
            ...state,
            matrixHighlighting: {
                ...state.matrixHighlighting,
                isFetching: true,
                hasRequestError: false,
                results: [],
                hasData: false,
            },
        };
    case 'PROCESS_MATRIX_HIGHLIGHTING_RESPONSE':
        return {
            ...state,
            matrixHighlighting: {
                ...state.matrixHighlighting,
                isFetching: false,
                results: action.response,
                hasData: true,
            },
        };
    case 'PROCESS_MATRIX_HIGHLIGHTING_REQUEST_ERROR':
        return {
            ...state,
            matrixHighlighting: {
                ...state.matrixHighlighting,
                isFetching: false,
                hasRequestError: true,
            },
        };
    default:
        return state;
    }
};

export default emailListView;
