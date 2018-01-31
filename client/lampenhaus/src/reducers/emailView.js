const emailView = (
    state = {
        docId: '',
        email: {},
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
            email: action.response.results[0],
            isFetchingEmail: false,
            hasEmailData,
        };
    }
    default:
        return state;
    }
};

export default emailView;
