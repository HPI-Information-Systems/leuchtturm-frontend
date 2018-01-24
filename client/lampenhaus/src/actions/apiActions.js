import axios from 'axios';
import { API_FETCH_GRAPH, API_FETCH_SUGGESTIONS } from './types';
import _ from 'lodash';

// const API_URL = 'http://localhost:5000/api';

function getAPI() {
    // return window.location.protocol + '//' + window.location.host + '/api';
    return '/api';
}

export function clearGraph() {
    return function (dispatch) {
        console.log('clear graph');
        dispatch({
            type: API_FETCH_GRAPH,
            payload: { nodes: [], links: [] },
        });
    };
}

// own cle language
export function fireCleLRequest(cleLQuery) {
    const cypherQuery = `Match (n)-[r:${cleLQuery.substr(cleLQuery.indexOf('->') + 2)}]-(m) WHERE n.title = '${cleLQuery.substr(0, cleLQuery.indexOf('->'))}' RETURN n,r,m`;

    return function (dispatch) {
        const request = `${getAPI()}/query/${cypherQuery}`;
        console.log(`request: ${request}`);
        axios.get(request)
            .then((response) => {
                dispatch({
                    type: API_FETCH_GRAPH,
                    payload: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };
}

export function fireCypherRequest(cypherQuery) {
    return function (dispatch) {
        const request = `${getAPI()}/query/${cypherQuery}`;
        console.log(`request: ${request}`);
        axios.get(request)
            .then((response) => {
                dispatch({
                    type: API_FETCH_GRAPH,
                    payload: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };
}

export function getNNodes(count) {
    return function (dispatch, getState) {
        if (getState().graphml.nodes) {
            const gNodes = getState().graphml.nodes;
            const gLinks = getState().graphml.links;
            const nodes = [];
            const links = [];
            if (count === 'all') {
                let keys = Object.keys(gNodes);
                for (const key in keys) {
                    if (keys.hasOwnProperty(key)) {
                        nodes.push(gNodes[keys[key]]);
                    }
                }
                keys = Object.keys(gLinks);
                for (const key in keys) {
                    if (keys.hasOwnProperty(key)) {
                        links.push(gLinks[keys[key]]);
                    }
                }
            }

            console.log(nodes, links);

            // to ensure that all other functions (like clearGraph) are already executed
            setTimeout(() => {
                dispatch({
                    type: API_FETCH_GRAPH,
                    payload: { nodes, links },
                });
            }, 100);
            return;
        }
        setTimeout(() => {
            dispatch({
                type: API_FETCH_GRAPH,
                payload: { nodes: [], links: [] },
            });
        }, 100);
    };
}

export function genNNodes(count) {
    return function (dispatch, getState) {
        const nodes = [];
        const links = [];
        const colors = [
            '#965E04',
            '#C89435',
            '#F7A456',
            '#AFCF8A',
            '#7B39DE',
            '#B095C0',
            '#D24556',
            '#93C2FA',
            '#9DB09E',
            '#F8C821',
        ];
        // Generate a random graph:
        for (let i = 0; i < count; i++) {
            nodes.push({
                id: `n${i}`,
                x: Math.random(),
                y: Math.random(),
                props: {
                    name: `Node ${i}`,
                    __color: colors[Math.floor(Math.random() * colors.length)],
                    __radius: Math.random() * 15 + 15,
                },
                type: 'Node',
            });
        }

        for (let i = 0; i < count * 5; i++) {
            links.push({
                id: `e${i}`,
                sourceId: `n${Math.random() * count | 0}`,
                targetId: `n${Math.random() * count | 0}`,
                props: {
                    __size: Math.random(),
                    __color: '#ccc',
                },
                type: 'Relation',
            });
        }
        setTimeout(() => {
            dispatch({
                type: API_FETCH_GRAPH,
                payload: { nodes, links },
            });
        }, 100);
    };
}

export function fetchSuggestions(search) {
    getAPI();

    return function (dispatch, getState) {
        if (getState().graphml.nodes) {
            const gNodes = getState().graphml.nodes;
            const gLinks = getState().graphml.links;
            const suggestions = [];
            search = search.toLowerCase();

            for (const i in gNodes) {
                if (gNodes.hasOwnProperty(i)) {
                    const node = gNodes[i];
                    try {
                        if (node.name.toString().toLowerCase().startsWith(search)) {
                            suggestions.push({ name: node.name, id: node.id, type: node.type });
                        }
                    } catch (err) {
                        // console.log(err);
                    }
                    try {
                        if (node.props.name.toString().toLowerCase().startsWith(search)) {
                            suggestions.push({ name: node.props.name, id: node.id, type: node.type });
                        }
                    } catch (err) {
                        // console.log(err);
                    }
                }
            }

            if (search === 'all') {
                suggestions.push({
                    name: 'Get all nodes', id: -1, type: 'count', query: search,
                });
            }

            if (search.startsWith('cle:gen')) {
                suggestions.push({
                    name: `Generate ${search.substring(7)} nodes`, id: -1, type: 'gen', query: search,
                });
            }

            // fetch suggestions from graphML
            dispatch({
                type: API_FETCH_SUGGESTIONS,
                payload: suggestions,
            });
            return;
        }

        if (search.startsWith('cle:gen')) {
            // fetch suggestions from graphML
            dispatch({
                type: API_FETCH_SUGGESTIONS,
                payload: [{
                    name: `Generate ${search.substring(7)} nodes`, id: -1, type: 'gen', query: search,
                }],
            });
            return;
        }

        // cypher query
        if (search.startsWith('cle:')) {
            dispatch({
                type: API_FETCH_SUGGESTIONS,
                payload: [{
                    type: 'Cypher', name: 'Execute Query', id: -1, query: search.substring(4),
                }],
            });
            return;
        }

        // cleL query
        if (search.includes('->')) {
            dispatch({
                type: API_FETCH_SUGGESTIONS,
                payload: [{
                    type: 'DSL', name: 'Execute DSL', id: -1, query: search,
                }],
            });
            return;
        }

        const request = `${getAPI()}/node/_suggest/${search}`;
        console.log(`request: ${request}`);
        axios.get(request)
            .then((response) => {
                dispatch({
                    type: API_FETCH_SUGGESTIONS,
                    payload: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };
}

export function fetchNeighbours(id) {
    return function (dispatch, getState) {
    // get neighbours from graphML
        if (getState().graphml.nodes) {
            const gNodes = getState().graphml.nodes;
            const gLinks = getState().graphml.links;

            let nodes = [];
            let links = [];
            const root = gNodes[id];

            nodes.push(root);
            root.neighbours.every((id) => {
                nodes.push(gNodes[id]);
                return true;
            });

            root.edges.every((edge) => {
                links.push(edge);
                return true;
            });

            nodes = _.uniqBy(nodes, 'id');
            links = _.uniqBy(links, 'id');

            const graph = { nodes, links, searchId: id };

            // to ensure that all other functions (like clearGraph) are already executed
            setTimeout(() => {
                dispatch({
                    type: API_FETCH_GRAPH,
                    payload: graph,
                });
            }, 100);
            return;
        }

        const request = `${getAPI()}/node/_id/${id}/_neighbors`;
        console.log(`request: ${request}`);
        axios.get(request)
            .then((response) => {
                // set id that is used for fetching the neighbours
                response.data.searchId = id;
                dispatch({
                    type: API_FETCH_GRAPH,

                    payload: response.data,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };
}
