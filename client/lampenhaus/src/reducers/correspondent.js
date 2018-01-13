const correspondent = (
    state = {
        emailAddress: '',
    },
    action,
) => {
    switch (action.type) {
    case 'SET_CORRESPONDENT_EMAIL_ADDRESS':
        return {
            ...state,
            emailAddress: action.emailAddress,
        };
    default:
        return state;
    }
};

export default correspondent;
