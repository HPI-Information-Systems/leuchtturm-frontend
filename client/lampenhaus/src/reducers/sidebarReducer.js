import { SIDEBAR_SHOW_INFO } from '../actions/types';

const INITIAL_STATE = { node: { props: {}, type: '' } };

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
    case SIDEBAR_SHOW_INFO:
        console.log('show node: ', action.payload);
        return { ...state, node: action.payload };
    }
    return state;
}
