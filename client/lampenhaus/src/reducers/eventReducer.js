import { EVENT_CLICK_SVG, EVENT_CLICK_NODE, EVENT_SELECTED_NODES, EVENT_NEW_GRAPH } from '../actions/types';

const INITIAL_STATE = { all: [], selected: [], graph: { nodes: [], links: [] } };

function buildEvent(data, type) {
    return { target: data, type, timeStamp: Date.now() };
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
    case EVENT_NEW_GRAPH:
        return { ...state, graph: action.payload };
    case EVENT_CLICK_NODE:
        return { ...state, all: state.all.concat(buildEvent(action.payload, 'click-node')) };
    case EVENT_CLICK_SVG:
        return { ...state, all: state.all.concat(buildEvent(action.payload, 'click-svg')) };
    case EVENT_SELECTED_NODES:
        return { ...state, selected: action.payload };
    default:
        return state;
    }
}
