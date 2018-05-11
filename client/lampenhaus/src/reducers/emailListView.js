const emailListView = (
    state = {
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
        emailListDatesResults: [],
        hasEmailListDatesData: false,
        isFetchingEmailListDatesData: false,
        isFetchingMatrixHighlighting: false,
        hasMatrixHighlightingData: false,
        matrixHighlightingResults: [],
    },
    action,
) => {
    switch (action.type) {
    case 'SUBMIT_EMAIL_LIST_SEARCH':
        return {
            ...state,
            activeSearchTerm: action.searchTerm,
            isFetchingMails: true,
            hasMailData: false,
            mailResults: [],
        };
    case 'PROCESS_EMAIL_LIST_RESULTS':
        return {
            ...state,
            mailResults: action.response.results,
            numberOfMails: action.response.numFound,
            isFetchingMails: false,
            hasMailData: true,
        };
    case 'SUBMIT_MATRIX_HIGHLIGHTING_SEARCH':
        return {
            ...state,
            isFetchingMatrixHighlighting: true,
            hasMatrixHighlightingData: false,
            matrixHighlightingResults: [],
        };
    case 'PROCESS_MATRIX_HIGHLIGHTING_RESULTS':
        return {
            ...state,
            isFetchingMatrixHighlighting: false,
            hasMatrixHighlightingData: true,
            matrixHighlightingResults: action.response,
        };
    case 'SUBMIT_CORRESPONDENT_SEARCH':
        return {
            ...state,
            activeSearchTerm: action.searchTerm,
            isFetchingCorrespondents: true,
            hasCorrespondentData: false,
            correspondentResults: [],
        };
    case 'PROCESS_CORRESPONDENT_RESULTS':
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
    case 'SUBMIT_EMAIL_LIST_DATES_REQUEST':
        return {
            ...state,
            isFetchingTermDatesData: true,
            emailListDatesResults: [],
            hasTermDatesData: false,
        };
    case 'PROCESS_EMAIL_LIST_DATES_RESPONSE':
        return {
            ...state,
            isFetchingTermDatesData: false,
            hasTermDatesData: true,
            emailListDatesResults: action.response,
        };
    default:
        return state;
    }
};

export default emailListView;
