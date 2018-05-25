const emailView = (
    state = {
        docId: '',
        email: {},
        isFetchingEmail: false,
        hasEmailData: false,
        hasEmailRequestError: false,
        similarEmails: [],
        isFetchingSimilarEmails: false,
        hasSimilarEmailsData: false,
        hasSimilarEmailsRequestError: false,
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
            isFetchingSimilarEmails: true,
            hasSimilarEmailsData: false,
            hasSimilarEmailsRequestError: false,
            similarEmails: [],
        };
    case 'PROCESS_SIMILAR_EMAILS_RESPONSE': {
        return {
            ...state,
            similarEmails: action.response,
            isFetchingSimilarEmails: false,
            hasSimilarEmailsData: true,
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
