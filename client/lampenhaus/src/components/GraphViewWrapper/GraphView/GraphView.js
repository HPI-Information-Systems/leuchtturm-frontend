import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { fetchNeighbours } from '../../../actions/apiActions';
import { callNodeClickEvent, callSvgClickEvent, callSelectedNodesEvent, callNewGraphEvent } from '../../../actions/eventActions';
import { showNodeInfo } from '../../../actions/sidebarActions';
import D3Network from './D3Network/D3Network';
import Legend from './Legend/Legend';
import GraphContextMenu from './GraphContextMenu/GraphContextMenu';

import './style.css';

class GraphView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            eventListener: {},
            savedNodes: {},
            graph: {
                nodes: [
                    {
                        id: 1,
                        type: 'person',
                        icon: '\uf2be',
                        props: {
                            name: 'b',
                            __radius: 15,
                            __color: '#000000',
                        },
                    },
                    {
                        id: 2,
                        type: 'person',
                        icon: '\uf2be',
                        props: {
                            name: 'a',
                            __radius: 15,
                            __color: '#000000',
                        },
                    },
                ],
                links: [
                    {
                        id: 3,
                        type: 'r',
                        props: {},
                        source: 1,
                        target: 2,
                        sourceId: 1,
                        targetId: 2,
                    },
                ],
            },
            filtered: {
                filteredNodes: [],
                filteredLinks: [],
            },
        };

        const self = this;
        // setup eventlistener
        this.state.eventListener.nodes = {
            dblclick(node) {
                self.props.fetchNeighbours(node.id);
            },
            click(node) {
                console.log('click', node);
                // if (!self.state.sidebarActive) self.props.toggleSideBar();
                self.props.showNodeInfo(node);
            },
        };

        this.state.eventListener.svg = {
            click(obj) {
                // self.props.callSvgClickEvent(obj);
            },
        };

        this.mergeGraph = this.mergeGraph.bind(this);
    }

    /**
   * @param hasNewSuggestions {boolean} - if a new suggestion was made
   *
   * merge newGraph with the old graph and with all filtered nodes and links
   * then all filters are applied and duplicates are removed
   *
   * at last it writes the new graph and filtered nodes and links to the state
   * */
    mergeGraph(newGraph, newSuggestions) {
        const hasNewSuggestions = this.props.suggestions !== newSuggestions;
        if ((!newGraph || newGraph.nodes.length === 0) && !hasNewSuggestions) {
            console.log('set state to zero');
            this.setState({ graph: { nodes: [], links: [], searchId: null } });
            return;
        }

        const self = this;

        function buildNode(node) {
            if (!node.props.__radius) node.props.__radius = 15;
            if (!node.props.__color) node.props.__color = node.props.color;
            if (!node.props.__color) node.props.__color = '#000000';
            return {
                id: node.id,
                type: node.type,
                icon: self.props.config.getIcon(node.type),
                x: node.x,
                y: node.y,
                props: node.props,
            };
        }

        // source and target are later replaced by node objects
        // sourceId and targetId are for filtering purpose
        function buildLink(link) {
            return {
                id: link.id,
                type: link.type,
                props: link.props || {},
                source: link.sourceId,
                target: link.targetId,
                sourceId: link.sourceId,
                targetId: link.targetId,
            };
        }

        function copyCoords(lastNodes, nodes) {
            const idToNode = _.keyBy(lastNodes, n => n.id);
            nodes.forEach((node) => {
                let oldNode;
                if (!idToNode.hasOwnProperty(node.id)) return;
                oldNode = idToNode[node.id];
                node.fx = oldNode.fx;
                node.fy = oldNode.fy;
                node.x = oldNode.x;
                node.y = oldNode.y;
                node.vx = 0;
                node.vy = 0;
            });
        }

        const nodeIds = [];
        const filteredNodeIds = [];
        const filteredNodes = [];

        // build nodes from old, new and filtered nodes
        let nodes = this.state.graph.nodes.concat(this.state.filtered.filteredNodes);
        nodes = nodes.concat(newGraph.nodes.map(buildNode));
        nodes = nodes.concat(newSuggestions.suggestedNodes.map((n) => {
            n.props = {};
            n.props.name = n.name;
            return buildNode(n);
        }));

        nodes = _.remove(nodes, (node) => {
            // remove suggested nodes
            if (newSuggestions.removedNodeIds[node.id]) {
                return false;
            }

            // filter nodes by type
            if (self.props.filter.nodeTypes[node.type]) {
                filteredNodeIds[node.id] = true;
                filteredNodes.push(node);
                return false;
            }

            // remove duplicates
            if (nodeIds[node.id]) return false;
            nodeIds[node.id] = true;

            return true;
        });

        nodes.forEach((node) => {
            const change = newSuggestions.changes[node.id];
            const tmpChange = newSuggestions.tmpChanges[node.id];
            const savedNodes = self.state.savedNodes;

            if (savedNodes[node.id] && !tmpChange) {
                Object.keys(savedNodes[node.id]).forEach((key) => {
                    node.props[key] = savedNodes[node.id][key];
                });

                savedNodes[node.id] = null;
                self.setState({ savedNodes });
            }

            if (change) {
                Object.keys(change).forEach((key) => {
                    node.props[key] = change[key];
                });
            }

            if (tmpChange) {
                if (!savedNodes[node.id]) {
                    savedNodes[node.id] = _.clone(node.props);
                    self.setState({ savedNodes });
                }
                Object.keys(tmpChange).forEach((key) => {
                    node.props[key] = tmpChange[key];
                });
            }
        });

        const filteredLinks = [];
        const linkIds = [];

        // build links from old, new and filtered links
        let links = this.state.graph.links.concat(this.state.filtered.filteredLinks);

        // reset node reference - let d3 handle and update it
        // TODO: not sure if we need this
        links.forEach((link) => {
            link.source = link.sourceId;
            link.target = link.targetId;
        });

        links = links.concat(newGraph.links.map(buildLink));

        links = links.concat(newSuggestions.suggestedLinks.map(l => buildLink(l)));

        links = _.remove(links, (link) => {
            // if no nodes exists
            if (!nodeIds[link.sourceId] || !nodeIds[link.targetId]) {
                return false;
            }

            // filter links by type or by filtered node
            if (filteredNodeIds[link.sourceId] || filteredNodeIds[link.targetId] || self.props.filter.linkTypes[link.type]) {
                filteredLinks.push(link);
                return false;
            }

            // remove duplicates
            if (linkIds[link.id]) return false;
            linkIds[link.id] = true;

            // if source and target is the same
            if (link.sourceId === link.targetId) return false;

            return true;
        });

        copyCoords(self.props.api.graph.nodes, nodes);

        this.props.callNewGraphEvent({ nodes, links });

        this.setState({
            graph: { nodes, links, searchId: newGraph.searchId },
            filtered: { filteredNodes, filteredLinks },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.api.graph !== nextProps.api.graph || this.props.filter !== nextProps.filter || this.props.suggestions !== nextProps.suggestions) {
            console.log('merge');
            this.mergeGraph(nextProps.api.graph, nextProps.suggestions);
        }
        console.log(test);
    }

    render() {
        return (
            <div>
                <D3Network
                    style={{ zIndex: -999 }}
                    nodes={this.state.graph.nodes}
                    links={this.state.graph.links}
                    searchId={this.state.graph.searchId}
                    eventListener={this.state.eventListener}
                    selectedNodes={this.props.callSelectedNodesEvent}
                />

                <Legend />
                {/* <GraphContextMenu show={this.state.useContextMenu} onHide={this.hideContextMenu}/> */}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        api: state.api,
        config: state.config,
        filter: state.filter,
        suggestions: state.suggestions,
    };
}

export default connect(mapStateToProps, {
    fetchNeighbours,
    showNodeInfo,
    callNodeClickEvent,
    callSvgClickEvent,
    callSelectedNodesEvent,
    callNewGraphEvent,
})(GraphView);
