import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import D3Network from './D3Network/D3Network';
import Spinner from '../Spinner/Spinner';
import { requestGraph } from '../../actions/graphActions';
import { requestSenderRecipientEmailList } from '../../actions/correspondentViewActions';
import './Graph.css';
import ResultListModal from '../ResultListModal/ResultListModal';

function mapStateToProps(state) {
    return {
        config: state.config,
        globalFilters: state.globalFilters,
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
    requestGraph,
    requestSenderRecipientEmailList,
}, dispatch);

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventListener: {},
            resultListModalOpen: false,
            emailAddresses: [],
            layouting: false,
            nodePositions: [],
        };

        const self = this;
        // setup eventlistener
        this.state.eventListener.nodes = {
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

        this.getSenderRecipientEmailListData = this.getSenderRecipientEmailListData.bind(this);
        this.toggleResultListModalOpen = this.toggleResultListModalOpen.bind(this);
        this.toggleLayouting = this.toggleLayouting.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const emailAddressesAreEqual =
            this.props.emailAddresses.length === nextProps.emailAddresses.length
            && this.props.emailAddresses.every((item, i) => item === nextProps.emailAddresses[i]);
        const filtersHaveChanged = this.props.globalFilters !== nextProps.globalFilters;
        if (nextProps.emailAddresses.length > 0 && (!emailAddressesAreEqual || filtersHaveChanged)) {
            const neighbours = (this.props.view === 'correspondent');
            this.props.requestGraph(nextProps.emailAddresses, neighbours);
        }
        this.setState({ emailAddresses: nextProps.emailAddresses });
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
                            />
                        </Fragment>
                    }
                    {!this.props.isFetchingGraph
                        && (this.props.emailAddresses.length === 0 || this.props.graph.nodes.length === 0)
                        && <span>No Graph to display.</span>
                    }
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
    emailAddresses: PropTypes.arrayOf(PropTypes.string).isRequired,
    view: PropTypes.string.isRequired,
    requestGraph: PropTypes.func.isRequired,
    isFetchingGraph: PropTypes.bool.isRequired,
    hasGraphData: PropTypes.bool.isRequired,
    globalFilters: PropTypes.shape({
        searchTerm: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        sender: PropTypes.string,
        recipient: PropTypes.string,
        selectedTopics: PropTypes.array,
        selectedEmailClasses: PropTypes.object,
    }).isRequired,
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
