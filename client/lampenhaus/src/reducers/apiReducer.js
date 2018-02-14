import { API_FETCH_SUGGESTIONS, API_FETCH_GRAPH } from '../actions/types';

const INITIAL_STATE = { suggestions: [], graph: { nodes: [], links: [], searchId: null } };

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
    case API_FETCH_SUGGESTIONS:
        return { ...state, suggestions: action.payload };
    case API_FETCH_GRAPH:
        return { ...state, graph: action.payload };
    default:
        return state;
    }
}
