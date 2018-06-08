const datasets = (
    state = {
        isFetchingDatasets: false,
        hasDatasetsData: false,
        hasDatasetRequestError: false,
        datasets: [],
        selectedDataset: '',
    },
    action,
) => {
    switch (action.type) {
    case 'SUBMIT_DATASETS_REQUEST':
        return {
            ...state,
            isFetchingDatasets: true,
            hasDatasetsData: false,
            datasets: [],
            hasDatasetRequestError: false,
        };
    case 'PROCESS_DATASETS_RESPONSE':
        return {
            ...state,
            isFetchingDatasets: false,
            hasDatasetsData: true,
            datasets: action.response,
        };
    case 'SET_SELECTED_DATASET':
        return {
            ...state,
            selectedDataset: action.dataset,
        };
    case 'PROCESS_DATASETS_REQUEST_ERROR':
        return {
            ...state,
            isFetchingDatasets: false,
            hasDatasetRequestError: true,
        };
    default:
        return state;
    }
};

export default datasets;
