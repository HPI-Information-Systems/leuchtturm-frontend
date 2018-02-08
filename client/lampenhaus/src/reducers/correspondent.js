const correspondent = (
    state = {
        emailAddress: '',
        correspondents: [],
        isFetchingCorrespondents: false,
        hasCorrespondentsData: false,
        terms: [],
        isFetchingTerms: false,
        hasTermsData: false,
        communication: [],
        isFetchingCommunication: false,
        hasCommunicationData: false,
    },
    action,
) => {
    switch (action.type) {
    case 'SET_CORRESPONDENT_EMAIL_ADDRESS':
        return {
            ...state,
            emailAddress: action.emailAddress,
        };
    case 'SUBMIT_CORRESPONDENT_REQUEST':
        return {
            ...state,
            isFetchingCorrespondents: true,
            hasCorrespondentsData: false,
            correspondents: [],
        };
    case 'PROCESS_CORRESPONDENTS_RESPONSE': {
        let hasCorrespondentsData = true;
        if (action.response === 'Error') {
            hasCorrespondentsData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            correspondents: action.response,
            isFetchingCorrespondents: false,
            hasCorrespondentsData,
        };
    }
    case 'SUBMIT_TERM_REQUEST':
        return {
            ...state,
            isFetchingTerms: true,
            hasTermsData: false,
            terms: [],
        };
    case 'PROCESS_TERMS_RESPONSE': {
        let hasTermsData = true;
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
    case 'SUBMIT_COMMUNICATION_REQUEST':
        return {
            ...state,
            isFetchingCommunication: true,
            hasCommunicationData: false,
            communication: [],
        };
    case 'PROCESS_COMMUNICATION_RESPONSE': {
        let hasCommunicationData = true;
        if (action.response === 'Error') {
            hasCommunicationData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            correspondents: action.response,
            isFetchingCommunication: false,
            hasCommunicationData,
        };
    }
    default:
        return state;
    }
};

export default correspondent;
