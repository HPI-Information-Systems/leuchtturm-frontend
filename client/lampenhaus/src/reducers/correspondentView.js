const correspondentView = (
    state = {
        shouldFetchData: false,
        identifyingName: '',
        correspondentInfo: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            data: {},
        },
        correspondentsForCorrespondent: {
            isFetching: false,
            hasData: false,
            data: {},
            hasRequestError: false,
        },
        termsForCorrespondent: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            data: [],
        },
        senderRecipientEmailList: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            data: [],
            sender: '',
            recipient: '',
        },
        topicsForCorrespondent: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            data: {},
        },
        mailboxAllEmails: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            data: [],
        },
        mailboxSentEmails: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            data: [],
        },
        mailboxReceivedEmails: {
            isFetching: false,
            hasData: false,
            hasRequestError: false,
            data: [],
        },
        emailDates: {
            isFetching: false,
            hasRequestError: false,
            data: {},
            hasData: false,
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
    case 'SET_CORRESPONDENT_IDENTIFYING_NAME':
        return {
            ...state,
            identifyingName: action.identifyingName,
        };
    case 'SUBMIT_CORRESPONDENT_INFO_REQUEST':
        return {
            ...state,
            correspondentInfo: {
                ...state.correspondentInfo,
                isFetching: true,
                hasData: false,
                data: {},
                hasRequestError: false,
            },
        };
    case 'PROCESS_CORRESPONDENT_INFO_RESPONSE': {
        return {
            ...state,
            correspondentInfo: {
                ...state.correspondentInfo,
                isFetching: false,
                hasData: true,
                data: action.response,
            },
        };
    }
    case 'PROCESS_CORRESPONDENT_INFO_REQUEST_ERROR': {
        return {
            ...state,
            correspondentInfo: {
                ...state.correspondentInfo,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    case 'SUBMIT_CORRESPONDENTS_FOR_CORRESPONDENT_REQUEST':
        return {
            ...state,
            correspondentsForCorrespondent: {
                ...state.correspondentsForCorrespondent,
                isFetching: true,
                hasData: false,
                data: {},
                hasRequestError: false,
            },
        };
    case 'PROCESS_CORRESPONDENTS_FOR_CORRESPONDENT_RESPONSE': {
        return {
            ...state,
            correspondentsForCorrespondent: {
                ...state.correspondentsForCorrespondent,
                isFetching: false,
                hasData: true,
                data: action.response,
            },
        };
    }
    case 'PROCESS_CORRESPONDENTS_FOR_CORRESPONDENT_REQUEST_ERROR': {
        return {
            ...state,
            correspondentsForCorrespondent: {
                ...state.correspondentsForCorrespondent,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    case 'SUBMIT_TERMS_FOR_CORRESPONDENT_REQUEST':
        return {
            ...state,
            termsForCorrespondent: {
                ...state.termsForCorrespondent,
                isFetching: true,
                hasData: false,
                data: [],
                hasRequestError: false,
            },
        };
    case 'PROCESS_TERMS_FOR_CORRESPONDENT_RESPONSE': {
        return {
            ...state,
            termsForCorrespondent: {
                ...state.termsForCorrespondent,
                isFetching: false,
                hasData: true,
                data: action.response,
            },
        };
    }
    case 'PROCESS_TERMS_FOR_CORRESPONDENTS_REQUEST_ERROR': {
        return {
            ...state,
            termsForCorrespondent: {
                ...state.termsForCorrespondent,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    case 'SUBMIT_SENDER_RECIPIENT_EMAIL_LIST_REQUEST':
        return {
            ...state,
            senderRecipientEmailList: {
                ...state.senderRecipientEmailList,
                isFetching: true,
                hasData: false,
                data: [],
                hasRequestError: false,
                sender: '',
                recipient: '',
            },
        };
    case 'PROCESS_SENDER_RECIPIENT_EMAIL_LIST_RESPONSE': {
        return {
            ...state,
            senderRecipientEmailList: {
                ...state.senderRecipientEmailList,
                isFetching: false,
                hasData: true,
                data: action.response.results,
                sender: action.response.senderEmail,
                recipient: action.response.recipientEmail,
            },
        };
    }
    case 'PROCESS_SENDER_RECIPIENT_EMAIL_LIST_REQUEST_ERROR': {
        return {
            ...state,
            senderRecipientEmailList: {
                ...state.senderRecipientEmailList,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    case 'SUBMIT_TOPICS_FOR_CORRESPONDENT_REQUEST':
        return {
            ...state,
            topicsForCorrespondent: {
                ...state.topicsForCorrespondent,
                isFetching: true,
                hasData: false,
                data: {},
                hasRequestError: false,
            },
        };
    case 'PROCESS_TOPICS_FOR_CORRESPONDENT_RESPONSE': {
        return {
            ...state,
            topicsForCorrespondent: {
                ...state.topicsForCorrespondent,
                isFetching: false,
                hasData: true,
                data: action.response,
            },
        };
    }
    case 'PROCESS_TOPICS_FOR_CORRESPONDENTS_REQUEST_ERROR': {
        return {
            ...state,
            topicsForCorrespondent: {
                ...state.topicsForCorrespondent,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    case 'SUBMIT_MAILBOX_ALL_EMAILS_REQUEST':
        return {
            ...state,
            mailboxAllEmails: {
                ...state.mailboxAllEmails,
                isFetching: true,
                hasData: false,
                data: [],
                hasRequestError: false,
            },
        };
    case 'PROCESS_MAILBOX_ALL_EMAILS_RESPONSE': {
        return {
            ...state,
            mailboxAllEmails: {
                ...state.mailboxAllEmails,
                isFetching: false,
                hasData: true,
                data: action.response.results,
            },
        };
    }
    case 'PROCESS_MAILBOX_ALL_EMAILS_REQUEST_ERROR': {
        return {
            ...state,
            mailboxAllEmails: {
                ...state.mailboxAllEmails,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    case 'SUBMIT_MAILBOX_SENT_EMAILS_REQUEST':
        return {
            ...state,
            mailboxSentEmails: {
                ...state.mailboxSentEmails,
                isFetching: true,
                hasData: false,
                data: [],
                hasRequestError: false,
            },
        };
    case 'PROCESS_MAILBOX_SENT_EMAILS_RESPONSE': {
        return {
            ...state,
            mailboxSentEmails: {
                ...state.mailboxSentEmails,
                isFetching: false,
                hasData: true,
                data: action.response.results,
            },
        };
    }
    case 'PROCESS_MAILBOX_SENT_EMAILS_REQUEST_ERROR': {
        return {
            ...state,
            mailboxSentEmails: {
                ...state.mailboxSentEmails,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    case 'SUBMIT_MAILBOX_RECEIVED_EMAILS_REQUEST':
        return {
            ...state,
            mailboxReceivedEmails: {
                ...state.mailboxReceivedEmails,
                isFetching: true,
                hasData: false,
                data: [],
                hasRequestError: false,
            },
        };
    case 'PROCESS_MAILBOX_RECEIVED_EMAILS_RESPONSE': {
        return {
            ...state,
            mailboxReceivedEmails: {
                ...state.mailboxReceivedEmails,
                isFetching: false,
                hasData: true,
                data: action.response.results,
            },
        };
    }
    case 'PROCESS_MAILBOX_RECEIVED_EMAILS_REQUEST_ERROR': {
        return {
            ...state,
            mailboxReceivedEmails: {
                ...state.mailboxReceivedEmails,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    case 'SUBMIT_EMAIL_DATES_REQUEST': {
        return {
            ...state,
            emailDates: {
                ...state.emailDates,
                isFetching: true,
                hasRequestError: false,
                data: {},
                hasData: false,
            },
        };
    }
    case 'PROCESS_EMAIL_DATES_RESPONSE': {
        return {
            ...state,
            emailDates: {
                ...state.emailDates,
                isFetching: false,
                data: action.response,
                hasData: true,
            },
        };
    }
    case 'PROCESS_EMAIL_DATES_REQUEST_ERROR': {
        return {
            ...state,
            emailDates: {
                ...state.emailDates,
                isFetching: false,
                hasRequestError: true,
            },
        };
    }
    default:
        return state;
    }
};

export default correspondentView;
