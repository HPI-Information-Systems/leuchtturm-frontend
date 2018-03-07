const correspondent = (
    state = {
        emailAddress: '',
        correspondents: [],
        isFetchingCorrespondents: false,
        hasCorrespondentsData: false,
        terms: [],
        isFetchingTerms: false,
        hasTermsData: false,
        senderRecipientEmailList: [],
        numberOfEmails: 0,
        isFetchingSenderRecipientEmailList: false,
        hasSenderRecipientEmailListData: false,
        senderRecipientEmailListSender: '',
        senderRecipientEmailListRecipient: '',
        topics: [],
        isFetchingTopics: false,
        hasTopicsData: false,
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
    case 'SUBMIT_SENDER_RECIPIENT_EMAIL_LIST_REQUEST':
        return {
            ...state,
            isFetchingSenderRecipientEmailList: true,
            hasSenderRecipientEmailListData: false,
            senderRecipientEmailList: [],
        };
    case 'PROCESS_SENDER_RECIPIENT_EMAIL_LIST_RESPONSE': {
        let hasSenderRecipientEmailListData = true;
        if (action.response === 'Error') {
            hasSenderRecipientEmailListData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            senderRecipientEmailList: action.response.results,
            senderRecipientEmailListSender: action.response.senderEmail,
            senderRecipientEmailListRecipient: action.response.recipientEmail,
            isFetchingSenderRecipientEmailList: false,
            hasSenderRecipientEmailListData,
        };
    }
    case 'SUBMIT_TOPICS_REQUEST':
        return {
            ...state,
            isFetchingTopics: true,
            hasTopicsData: false,
            topics: [],
        };
    case 'PROCESS_TOPICS_RESPONSE': {
        let hasTopicsData = true;
        if (action.response === 'Error') {
            hasTopicsData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a databse: ', action.responseHeader);
        }
        return {
            ...state,
            topics: action.response,
            isFetchingTopics: false,
            hasTopicsData,
        };
    }
    default:
        return state;
    }
};

export default correspondent;
