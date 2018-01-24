import { FILTER_NODE_TYPE, FILTER_LINK_TYPE } from './types';

export function filterNodeType(type) {
    return function (dispatch) {
        dispatch({
            type: FILTER_NODE_TYPE,
            payload: type,
        });
    };
}

export function filterLinkType(type) {
    return function (dispatch) {
        dispatch({
            type: FILTER_LINK_TYPE,
            payload: type,
        });
    };
}
