import { EVENT_CLICK_SVG, EVENT_CLICK_NODE, EVENT_SELECTED_NODES, EVENT_NEW_GRAPH } from '../actions/types';

const INITIAL_STATE = { all: [], selected: [],
    graph: {
        nodes: [
            {
                id: 1,
                type: "1",
                icon: "brightness_1",
                props: {
                    name: "b",
                    __radius: 15,
                    __color: "#000000"
                },
            },
            {
                id: 2,
                type: "1",
                icon: "brightness_1",
                props: {
                    name: "a",
                    __radius: 15,
                    __color: "#000000"
                },
            },
        ],
        links: [
            {
                id: 3,
                type: "r",
                icon: "brightness_1",
                props: {},
                source: 1,
                target: 2,
                sourceId: 1,
                targetId: 2,
            },
        ] } };

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
    }
    return state;
}

function buildEvent(data, type) {
    return { target: data, type, timeStamp: Date.now() };
}
