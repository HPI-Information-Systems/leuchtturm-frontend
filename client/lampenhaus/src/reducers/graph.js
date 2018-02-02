const graph = (
    state = {
        isFetchingGraph: true,
        hasGraphData: false,
        graph: {
            nodes: [],
            links: [],
        },
    },
    action,
) => {
    switch (action.type) {
    case 'SUBMIT_GRAPH_REQUEST':
        return {
            ...state,
            isFetchingGraph: true,
            hasGraphData: false,
            graph: {
                nodes: [],
                links: [],
            },
        };
    case 'PROCESS_GRAPH_RESPONSE': {
        let hasGraphData = true;
        if (action.response === 'Error') {
            hasGraphData = false;
            // eslint-disable-next-line no-console
            console.error('Error occurred in Flask backend or during a request to a database: ', action.responseHeader);
        }
        return {
            ...state,
            isFetchingGraph: false,
            hasGraphData,
            graph: action.response,
        };
    }
    default:
        return state;
    }
};

export default graph;
