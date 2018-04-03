const termView = (
    state = {
        searchTerm: '',
        activeSearchTerm: '',
        mailResults: [],
        correspondentResults: [],
        numberOfMails: 0,
        numberOfCorrespondents: 0,
        activePageNumber: 1,
        resultsPerPage: 10,
        isFetchingMails: false,
        isFetchingCorrespondents: false,
        hasMailData: false,
        hasCorrespondentData: false,
        termDatesResults: [],
        hasTermDatesData: false,
        isFetchingTermDatesData: false,
    },
    action,
) => {
    switch (action.type) {
    case 'UPDATE_SEARCH_TERM':
        return {
            ...state,
            searchTerm: action.searchTerm,
        };
    case 'SUBMIT_MAIL_SEARCH':
        return {
            ...state,
            activeSearchTerm: action.searchTerm,
            isFetchingMails: true,
            hasMailData: false,
            mailResults: [],
        };
    case 'SUBMIT_CORRESPONDENT_SEARCH':
        return {
            ...state,
            activeSearchTerm: action.searchTerm,
            isFetchingCorrespondents: true,
            hasCorrespondentData: false,
            correspondentResults: [],
        };
    case 'RECEIVE_MAIL_RESULTS':
        return {
            ...state,
            mailResults: action.response.results,
            numberOfMails: action.response.numFound,
            isFetchingMails: false,
            hasMailData: true,
        };
    case 'RECEIVE_CORRESPONDENT_RESULTS':
        return {
            ...state,
            correspondentResults: action.response.correspondents,
            numberOfCorrespondents: action.response.numFound,
            isFetchingCorrespondents: false,
            hasCorrespondentData: true,
        };
    case 'CHANGE_PAGE_NUMBER_TO':
        return {
            ...state,
            activePageNumber: action.pageNumber,
        };
    case 'SUBMIT_TERM_DATES_REQUEST':
        return {
            ...state,
            isFetchingTermDatesData: true,
            termDatesResults: [],
            hasTermDatesData: false,
        };
    case 'PROCESS_TERM_DATES_RESPONSE':
        return {
            ...state,
            isFetchingTermDatesData: false,
            hasTermDatesData: true,
            termDatesResults: action.response.docList,
        };
    default:
        return state;
    }
};

export default termView;
