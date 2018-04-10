import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { UncontrolledTooltip  } from 'reactstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import D3Network from './D3Network/D3Network';
import Legend from './Legend/Legend';
import Spinner from '../Spinner/Spinner';
import { requestGraph, requestSenderRecipientEmailList } from '../../actions/actions';
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
import './Graph.css';
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
        senderRecipientEmailList: state.correspondentView.senderRecipientEmailList,
        isFetchingSenderRecipientEmailList: state.correspondentView.isFetchingSenderRecipientEmailList,
        hasSenderRecipientEmailListData: state.correspondentView.hasSenderRecipientEmailListData,
        senderRecipientEmailListSender: state.correspondentView.senderRecipientEmailListSender,
        senderRecipientEmailListRecipient: state.correspondentView.senderRecipientEmailListRecipient,
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
    requestSenderRecipientEmailList,
}, dispatch);

class Graph extends Component {
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
            layouting: false,
            nodePositions: [],
        };

        const self = this;
        // setup eventlistener
        this.state.eventListener.nodes = {
            dblclick(node) {
                self.props.fetchNeighbours(node.id);
            },
            click: (node) => {
                const nodeEmailAddress = node.props.name;
                if (this.props.view === 'correspondent') {
                    if (!this.state.emailAddresses.includes(nodeEmailAddress)) {
                        this.setState({
                            emailAddresses: this.state.emailAddresses.concat([nodeEmailAddress]),
                        });
                        props.requestGraph(this.state.emailAddresses, true);
                    }
                } else {
                    this.props.history.push(`/correspondent/${nodeEmailAddress}`);
                }
            },
        };

        this.state.eventListener.links = {
            click(link) {
                self.getSenderRecipientEmailListData(link.source.props.name, link.target.props.name);
            },
        };

        this.mergeGraph = this.mergeGraph.bind(this);
        this.getSenderRecipientEmailListData = this.getSenderRecipientEmailListData.bind(this);
        this.toggleResultListModalOpen = this.toggleResultListModalOpen.bind(this);
        this.toggleLayouting = this.toggleLayouting.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const emailAddressesAreEqual =
            this.props.emailAddresses.length === nextProps.emailAddresses.length
            && this.props.emailAddresses.every((item, i) => item === nextProps.emailAddresses[i]);
        if (!emailAddressesAreEqual && nextProps.emailAddresses.length > 0) {
            const neighbours = (this.props.view === 'correspondent');
            this.props.requestGraph(nextProps.emailAddresses, neighbours);
        }
        this.setState({ emailAddresses: nextProps.emailAddresses });
        if (this.props.api.graph !== nextProps.api.graph
            || this.props.filter !== nextProps.filter
            || this.props.suggestions !== nextProps.suggestions) {
            console.log('merge');
            this.mergeGraph(nextProps.api.graph, nextProps.suggestions);
        }
    }

    getSenderRecipientEmailListData(sender, recipient) {
        this.props.requestSenderRecipientEmailList(sender, recipient);
        this.toggleResultListModalOpen();
    }

    toggleResultListModalOpen() {
        this.setState({ resultListModalOpen: !this.state.resultListModalOpen });
    }

    toggleLayouting() {
        this.setState({ layouting: !this.state.layouting });
    }

    /**
   * @param hasNewSuggestions {boolean} - if a new suggestion was made
   *
   * merge newGraph with the old graph and with all filtered nodes and links
   * then all filters are applied and duplicates are removed
   *
   * at last it writes the new graph and filtered nodes and links to the state
   * */
    mergeGraph(newGraph, newSuggestions, newLayout) {
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

        let nodePositions = [];
        if (newLayout.type === 'dbltree') {
            nodePositions = this.buildTreeLayout(nodes, links, newLayout.centerNodes);
        }

        this.setState({
            nodePositions,
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
                    {this.props.hasGraphData
                        && this.props.graph.nodes.length > 0
                        && this.props.emailAddresses.length > 0
                        &&
                        <Fragment>
                            <FontAwesome
                                id="relayout-button"
                                name="refresh"
                                spin={this.state.layouting}
                                onClick={this.toggleLayouting}
                                size="2x"
                            />
                            <UncontrolledTooltip placement="bottom" target="relayout-button">
                                Relayout the graph
                            </UncontrolledTooltip>
                            <D3Network
                                style={{ zIndex: -999 }}
                                nodes={this.props.graph.nodes}
                                links={this.props.graph.links}
                                nodePositions={this.state.nodePositions}
                                searchId={4}
                                layouting={this.state.layouting}
                                eventListener={this.state.eventListener}
                                selectedNodes={this.props.callSelectedNodesEvent}
                            />
                        </Fragment>
                    }
                    {!this.props.isFetchingGraph
                        && (this.props.emailAddresses.length === 0 || this.props.graph.nodes.length === 0)
                        && <span>No Graph to display.</span>
                    }

                    <Legend />
                    {/* <GraphContextMenu show={this.state.useContextMenu} onHide={this.hideContextMenu}/> */}
                </div>
                {this.props.isFetchingSenderRecipientEmailList &&
                    <FontAwesome spin name="spinner" size="2x" />
                }
                {this.props.hasSenderRecipientEmailListData &&
                    <ResultListModal
                        isOpen={this.state.resultListModalOpen}
                        toggleModalOpen={this.toggleResultListModalOpen}
                        results={this.props.senderRecipientEmailList}
                        isFetching={this.props.isFetchingSenderRecipientEmailList}
                        hasData={this.props.hasSenderRecipientEmailListData}
                        senderEmail={this.props.senderRecipientEmailListSender}
                        recipientEmail={this.props.senderRecipientEmailListRecipient}
                    />
                }
            </main>
        );
    }
}

Graph.propTypes = {
    emailAddresses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    view: PropTypes.string.isRequired,
    requestGraph: PropTypes.func.isRequired,
    isFetchingGraph: PropTypes.bool.isRequired,
    hasGraphData: PropTypes.bool.isRequired,
    graph: PropTypes.shape({
        nodes: PropTypes.array,
        links: PropTypes.array,
    }).isRequired,
    requestSenderRecipientEmailList: PropTypes.func.isRequired,
    isFetchingSenderRecipientEmailList: PropTypes.bool.isRequired,
    hasSenderRecipientEmailListData: PropTypes.bool.isRequired,
    senderRecipientEmailListSender: PropTypes.string.isRequired,
    senderRecipientEmailListRecipient: PropTypes.string.isRequired,
    senderRecipientEmailList: PropTypes.arrayOf(PropTypes.shape({
        doc_id: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Graph));
