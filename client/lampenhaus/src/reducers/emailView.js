const emailView = (
    state = {
        docId: '',
        email: {},
        isFetchingEmail: false,
        hasEmailData: false,
        similarEmails: [],
        isFetchingSimilarEmails: false,
        hasSimilarEmailsData: false,
    },
    action,
) => {
    switch (action.type) {
    case 'SET_DOC_ID':
        return {
            ...state,
            docId: action.docId,
        };
    case 'SUBMIT_EMAIL_REQUEST':
        return {
            ...state,
            isFetchingEmail: true,
            hasEmailData: false,
            email: {},
        };
    case 'PROCESS_EMAIL_RESPONSE': {
        let hasEmailData = true;
        if (action.response === 'Error') {
            hasEmailData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            email: action.response.email,
            isFetchingEmail: false,
            hasEmailData,
        };
    }
    case 'SUBMIT_SIMILAR_EMAILS_REQUEST':
        return {
            ...state,
            isFetchingSimilarEmails: true,
            hasSimilarEmailsData: false,
            similarEmails: [],
        };
    case 'PROCESS_SIMILAR_EMAILS_RESPONSE': {
        let hasSimilarEmailsData = true;
        if (action.response === 'Error') {
            hasSimilarEmailsData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            similarEmails: action.response,
            isFetchingSimilarEmails: false,
            hasSimilarEmailsData,
        };
    }
    default:
        return state;
    }
};

export default emailView;
