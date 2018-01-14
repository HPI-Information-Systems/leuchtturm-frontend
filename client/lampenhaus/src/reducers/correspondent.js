const correspondent = (
    state = {
        emailAddress: '',
        correspondents: [],
        terms: [],
    },
    action,
) => {
    switch (action.type) {
    case 'SUBMIT_CORRESPONDENT_REQUEST':
        return {
            ...state,
            emailAddress: action.emailAddress,
            isFetchingCorrespondents: true,
            correspondents: [],
        };
    case 'PROCESS_CORRESPONDENTS_RESPONSE': {
        let hasCorrespondentData = true;
        // TODO: put this into some kind of handle error function
        if (action.response === 'Error') {
            hasCorrespondentData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            correspondents: action.response,
            isFetchingCorrespondents: false,
            hasCorrespondentData,
        };
    }
    case 'SUBMIT_TERM_REQUEST':
        return {
            ...state,
            emailAddress: action.emailAddress,
            isFetchingTerms: true,
            terms: [],
        };
    case 'PROCESS_TERMS_RESPONSE': {
        let hasTermsData = true;
        // TODO: put this into some kind of handle error function
        if (action.response === 'Error') {
            hasTermsData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a databse: ', action.responseHeader);
        }
        return {
            ...state,
            terms: action.response,
            isFetchingTerms: false,
            hasTermsData,
        };
    }
    default:
        return state;
    }
};

export default correspondent;
