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
        termDatesResults: [],
        hasTermDatesData: false,
        isFetchingTermDatesData: false,
        isFetchingDocIdList: false,
        hasDocIdListData: false,
        docIdListResults: [],
    },
    action,
) => {
    switch (action.type) {
    case 'SUBMIT_MAIL_SEARCH':
        return {
            ...state,
            activeSearchTerm: action.searchTerm,
            isFetchingMails: true,
            hasMailData: false,
            mailResults: [],
        };
    case 'PROCESS_MAIL_RESULTS':
        return {
            ...state,
            mailResults: action.response.results,
            numberOfMails: action.response.numFound,
            isFetchingMails: false,
            hasMailData: true,
        };
    case 'SUBMIT_DOC_ID_LIST_SEARCH':
        return {
            ...state,
            isFetchingDocIdList: true,
            hasDocIdListData: false,
            docIdListResults: [],
        };
    case 'PROCESS_DOC_ID_LIST_RESULTS':
        return {
            ...state,
            isFetchingDocIdList: false,
            hasDocIdListData: true,
            docIdListResults: action.response.results,
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
            termDatesResults: action.response,
        };
    default:
        return state;
    }
};

export default emailListView;
