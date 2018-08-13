const emailView = (
    state = {
        docId: '',
        email: {},
        isFetchingEmail: false,
        hasEmailData: false,
        hasEmailRequestError: false,
        similarEmails: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            data: {
                docs: [],
                dates: {},
            },
        },
        showRawBody: false,
        topics: {},
    },
    action,
) => {
    switch (action.type) {
    case 'SET_DOC_ID':
        return {
            ...state,
            docId: action.docId,
            showRawBody: false,
        };
    case 'SUBMIT_EMAIL_REQUEST':
        return {
            ...state,
            isFetchingEmail: true,
            hasEmailData: false,
            hasEmailRequestError: false,
            email: {},
        };
    case 'PROCESS_EMAIL_RESPONSE': {
        return {
            ...state,
            email: action.response.email,
            isFetchingEmail: false,
            hasEmailData: true,
        };
    }
    case 'PROCESS_EMAIL_REQUEST_ERROR':
        return {
            ...state,
            isFetchingEmail: false,
            hasEmailRequestError: true,
        };
    case 'SUBMIT_SIMILAR_EMAILS_REQUEST':
        return {
            ...state,
            similarEmails: {
                ...state.similarEmails,
                isFetching: true,
                hasData: false,
                data: {
                    docs: [],
                    dates: {},
                },
                hasRequestError: false,
            },
        };
    case 'PROCESS_SIMILAR_EMAILS_RESPONSE': {
        return {
            ...state,
            similarEmails: {
                ...state.similarEmails,
                isFetching: false,
                hasData: true,
                data: action.response,
            },
        };
    }
    case 'PROCESS_SIMILAR_EMAILS_REQUEST_ERROR':
        return {
            ...state,
            isFetchingEmail: false,
            hasEmailRequestError: true,
        };
    case 'SET_BODY_TYPE_RAW':
        return {
            ...state,
            showRawBody: true,
        };
    case 'SET_BODY_TYPE_CLEAN':
        return {
            ...state,
            showRawBody: false,
        };
    default:
        return state;
    }
};

export default emailView;
