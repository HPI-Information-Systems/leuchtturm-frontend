import { FILTER_NODE_TYPE, FILTER_LINK_TYPE } from '../actions/types';

const INITIAL_STATE = { nodeTypes: [], linkTypes: [] };

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
    case FILTER_NODE_TYPE:
        const nodeTypes = state.nodeTypes;
        nodeTypes[action.payload] = !nodeTypes[action.payload];

        return { ...state, nodeTypes };
    case FILTER_LINK_TYPE:
        const linkTypes = state.linkTypes;
        linkTypes[action.payload] = !linkTypes[action.payload];

        return { ...state, linkTypes };
    }
    return state;
}
