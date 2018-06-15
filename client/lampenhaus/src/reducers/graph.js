const graph = (
    state = {
        isFetchingGraph: false,
        hasGraphData: false,
        hasRequestError: false,
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
            hasRequestError: false,
            graph: {
                nodes: [],
                links: [],
            },
        };
    case 'PROCESS_GRAPH_RESPONSE': {
        return {
            ...state,
            isFetchingGraph: false,
            hasGraphData: true,
            graph: action.response,
        };
    }
    case 'PROCESS_GRAPH_REQUEST_ERROR':
        return {
            ...state,
            isFetchingGraph: false,
            hasRequestError: true,
        };
    default:
        return state;
    }
};

export default graph;
