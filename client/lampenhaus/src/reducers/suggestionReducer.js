import {
    SUGGESTION_ADD_NODE,
    SUGGESTION_ADD_LINK,
    SUGGESTION_CHANGE_NODE,
    SUGGESTION_TMP_CHANGE_NODE,
    SUGGESTION_REMOVE_NODE,
} from '../actions/types';

const INITIAL_STATE = {
    suggestedNodes: [],
    suggestedLinks: [],
    changes: {},
    tmpChanges: {},
    removedNodeIds: {},
};

export default function (state = INITIAL_STATE, action) {
    let arr;
    switch (action.type) {
    case SUGGESTION_ADD_NODE:
        return { ...state, suggestedNodes: state.suggestedNodes.concat(action.payload) };

    case SUGGESTION_REMOVE_NODE:
        arr = state.removedNodeIds;
        arr[action.payload] = true;
        return { ...state, removedNodeIds: arr };

    case SUGGESTION_ADD_LINK:
        return { ...state, suggestedLinks: state.suggestedLinks.concat(action.payload) };

    case SUGGESTION_CHANGE_NODE:
        arr = state.changes;
        // eslint-disable-next-line no-param-reassign
        state.changes[action.payload.id] = action.payload.props;
        return { ...state, changes: arr };
    case SUGGESTION_TMP_CHANGE_NODE:
        arr = state.tmpChanges;
        // eslint-disable-next-line no-param-reassign
        state.tmpChanges[action.payload.id] = action.payload.props;
        return { ...state, tmpChanges: arr };
    default:
        return state;
    }
}
