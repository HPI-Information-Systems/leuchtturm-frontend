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
    case 'PROCESS_DATASETS_RESPONSE': {
        let hasDatasetsData = true;
        if (action.response === 'Error') {
            hasDatasetsData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            isFetchingDatasets: false,
            hasDatasetsData,
            datasets: action.response,
        };
    }
    case 'SET_SELECTED_DATASET': {
        return {
            ...state,
            selectedDataset: action.dataset,
        };
    }
    case 'PROCESS_DATASETS_REQUEST_ERROR':
        return {
            ...state,
            hasDatasetRequestError: true,
        };
    default:
        return state;
    }
};

export default datasets;
