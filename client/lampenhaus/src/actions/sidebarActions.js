import { SIDEBAR_SHOW_INFO } from './types';

export function showNodeInfo(node) {
    return function (dispatch) {
        dispatch({
            type: SIDEBAR_SHOW_INFO,
            payload: node,
        });
    };
}
