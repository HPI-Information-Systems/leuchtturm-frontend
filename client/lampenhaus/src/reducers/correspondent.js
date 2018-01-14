const correspondent = (
    state = {
        emailAddress: '',
        correspondents: [],
    },
    action,
) => {
    switch (action.type) {
    case 'SUBMIT_CORRESPONDENT_REQUEST':
        return {
            ...state,
            emailAddress: action.emailAddress,
            isFetching: true,
            correspondents: [],
        };
    case 'PROCESS_CORRESPONDENT_RESPONSE': {
        let hasData = true;
        // TODO: put this into some kind of handle error function
        if (action.response === 'Error') {
            hasData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            correspondents: action.response,
            isFetching: false,
            hasData,
        };
    }
    default:
        return state;
    }
};

export default correspondent;
