import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import D3Network from './D3Network/D3Network';
import Legend from './Legend/Legend';
import Spinner from '../Spinner/Spinner';
import { requestGraph, requestSenderReceiverEmailList } from '../../actions/actions';
import {
    clearGraph,
    fetchSuggestions,
    fetchNeighbours,
    fireCypherRequest,
    fireCleLRequest,
    genNNodes,
    getNNodes,
} from '../../actions/apiActions';
import {
    callNodeClickEvent,
    callSvgClickEvent,
    callSelectedNodesEvent,
    callNewGraphEvent,
} from '../../actions/eventActions';
import './GraphView.css';
import ResultListModal from '../ResultListModal/ResultListModal';

function mapStateToProps(state) {
    return {
        api: state.api,
        config: state.config,
        filter: state.filter,
        suggestions: state.suggestions,
        graph: state.graph.graph,
        hasGraphData: state.graph.hasGraphData,
        isFetchingGraph: state.graph.isFetchingGraph,
        senderReceiverEmailList: state.correspondent.senderReceiverEmailList,
        isFetchingSenderReceiverEmailList: state.correspondent.isFetchingSenderReceiverEmailList,
        hasSenderReceiverEmailListData: state.correspondent.hasSenderReceiverEmailListData,
        senderReceiverEmailListSender: state.correspondent.senderReceiverEmailListSender,
        senderReceiverEmailListReceiver: state.correspondent.senderReceiverEmailListReceiver,
    };
}

const mapDispatchToProps = dispatch => bindActionCreators({
    clearGraph,
    fetchSuggestions,
    fetchNeighbours,
    fireCypherRequest,
    fireCleLRequest,
    getNNodes,
    genNNodes,
    requestGraph,
    callNodeClickEvent,
    callSvgClickEvent,
    callSelectedNodesEvent,
    callNewGraphEvent,
    requestSenderReceiverEmailList,
}, dispatch);

class GraphView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventListener: {},
            filtered: {
                filteredNodes: [],
                filteredLinks: [],
            },
            resultListModalOpen: false,
            emailAddresses: [],
        };

        const self = this;
        // setup eventlistener
        this.state.eventListener.nodes = {
            dblclick(node) {
                self.props.fetchNeighbours(node.id);
            },
            click: function(node) {
                console.log('click node', node);
                // self.props.showNodeInfo(node);
                if (!this.state.emailAddresses.includes(node.props.name)) {
                    this.setState({ emailAddresses: this.state.emailAddresses.concat([node.props.name])});
                    props.requestGraph(this.state.emailAddresses);
                }
            }.bind(this),
        };

        this.state.eventListener.links = {
            click(link) {
                self.getSenderReceiverEmailListData(link.source.props.name, link.target.props.name);
            },
        };

        this.mergeGraph = this.mergeGraph.bind(this);
        this.getSenderReceiverEmailListData = this.getSenderReceiverEmailListData.bind(this);
        this.toggleResultListModalOpen = this.toggleResultListModalOpen.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.emailAddress !== nextProps.emailAddress) {
            this.props.requestGraph([nextProps.emailAddress]);
            this.setState({ emailAddresses: [nextProps.emailAddress] });
        }
        if (this.props.api.graph !== nextProps.api.graph
            || this.props.filter !== nextProps.filter
            || this.props.suggestions !== nextProps.suggestions) {
            console.log('merge');
            this.mergeGraph(nextProps.api.graph, nextProps.suggestions);
        }
    }

    getSenderReceiverEmailListData(sender, receiver) {
        this.props.requestSenderReceiverEmailList(sender, receiver);
        this.toggleResultListModalOpen();
    }

    toggleResultListModalOpen() {
        this.setState({ resultListModalOpen: !this.state.resultListModalOpen });
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
            if (filteredNodeIds[link.sourceId]
                || filteredNodeIds[link.targetId]
                || self.props.filter.linkTypes[link.type]) {
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

    render() {
        return (
            <main>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic"
                />
                <div>
                    {this.props.isFetchingGraph &&
                        <Spinner />
                    }
                    {this.props.hasGraphData &&
                        <D3Network
                            style={{ zIndex: -999 }}
                            nodes={this.props.graph.nodes}
                            links={this.props.graph.links}
                            searchId={4}
                            eventListener={this.state.eventListener}
                            selectedNodes={this.props.callSelectedNodesEvent}
                        />
                    }

                    <Legend />
                    {/* <GraphContextMenu show={this.state.useContextMenu} onHide={this.hideContextMenu}/> */}
                </div>
                {this.props.isFetchingSenderReceiverEmailList &&
                    <FontAwesome spin name="spinner" size="2x" />
                }
                {this.props.hasSenderReceiverEmailListData &&
                    <ResultListModal
                        isOpen={this.state.resultListModalOpen}
                        toggleModalOpen={this.toggleResultListModalOpen}
                        results={this.props.senderReceiverEmailList}
                        isFetching={this.props.isFetchingSenderReceiverEmailList}
                        hasData={this.props.hasSenderReceiverEmailListData}
                        senderEmail={this.props.senderReceiverEmailListSender}
                        receiverEmail={this.props.senderReceiverEmailListReceiver}
                    />
                }
            </main>
        );
    }
}

GraphView.propTypes = {
    emailAddress: PropTypes.string.isRequired,
    requestGraph: PropTypes.func.isRequired,
    isFetchingGraph: PropTypes.bool.isRequired,
    hasGraphData: PropTypes.bool.isRequired,
    graph: PropTypes.shape({
        nodes: PropTypes.array,
        links: PropTypes.array,
    }).isRequired,
    requestSenderReceiverEmailList: PropTypes.func.isRequired,
    isFetchingSenderReceiverEmailList: PropTypes.bool.isRequired,
    hasSenderReceiverEmailListData: PropTypes.bool.isRequired,
    senderReceiverEmailListSender: PropTypes.string.isRequired,
    senderReceiverEmailListReceiver: PropTypes.string.isRequired,
    senderReceiverEmailList: PropTypes.arrayOf(PropTypes.shape({
        doc_id: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphView);
