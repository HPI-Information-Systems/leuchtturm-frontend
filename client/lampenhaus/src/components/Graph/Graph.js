import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { UncontrolledTooltip, Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import D3Network from './D3Network/D3Network';
import Spinner from '../Spinner/Spinner';
import { requestGraph } from '../../actions/graphActions';
import { requestSenderRecipientEmailList } from '../../actions/correspondentViewActions';
import './Graph.css';
import ResultListModal from '../ResultListModal/ResultListModal';

function mapStateToProps(state) {
    return {
        config: state.config,
        globalFilter: state.globalFilter.filters,
        graph: state.graph.graph,
        hasGraphData: state.graph.hasGraphData,
        isFetchingGraph: state.graph.isFetchingGraph,
        hasRequestError: state.graph.hasRequestError,
        senderRecipientEmailList: state.correspondentView.senderRecipientEmailList,
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
            errorModalOpen: true,
            identifyingNames: [],
            layouting: false,
            nodePositions: [],
        };

        const self = this;
        // setup eventlistener
        this.state.eventListener.nodes = {
            click: (node) => {
                const nodeIdentifyingName = node.props.name;
                if (this.props.view === 'correspondent') {
                    if (!this.state.identifyingNames.includes(nodeIdentifyingName)) {
                        this.setState({
                            identifyingNames: this.state.identifyingNames.concat([nodeIdentifyingName]),
                        });
                        props.requestGraph(this.state.identifyingNames, true, this.props.globalFilter);
                    }
                } else {
                    this.props.history.push(`/correspondent/${nodeIdentifyingName}`);
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
        this.toggleErrorModalOpen = this.toggleErrorModalOpen.bind(this);
        this.toggleLayouting = this.toggleLayouting.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(
            nextProps.identifyingNames.length > 0 &&
            this.props.isFetchingCorrespondents &&
            !nextProps.isFetchingCorrespondents
        ) {
            const isCorrespondentView = (this.props.view === 'correspondent');
            this.props.requestGraph(nextProps.identifyingNames, isCorrespondentView, nextProps.globalFilter);
        }
        this.setState({ identifyingNames: nextProps.identifyingNames });
    }

    getSenderRecipientEmailListData(sender, recipient) {
        this.props.requestSenderRecipientEmailList(sender, recipient, this.props.globalFilter);
        this.toggleResultListModalOpen();
    }

    toggleResultListModalOpen() {
        this.setState({ resultListModalOpen: !this.state.resultListModalOpen });
    }

    toggleErrorModalOpen() {
        this.setState({ errorModalOpen: !this.state.errorModalOpen });
    }

    toggleLayouting() {
        this.setState({ layouting: !this.state.layouting });
    }

    render() {
        let className = 'graph';
        if (!this.props.show && !this.props.isMaximized) {
            className += ' d-none';
        }
        return this.props.hasRequestError ? (
            <Card className={className}>
                <CardHeader tag="h4">Top Correspondents Network</CardHeader>
                <CardBody className="text-danger">
                    An error occurred while requesting the Top Correspondents Network.
                </CardBody>
            </Card>
        ) : (
            <Card className={className}>
                <CardHeader tag="h4">
                    {this.props.title}
                    <div className="pull-right">
                        {this.props.hasGraphData
                        && this.props.graph.nodes.length > 0
                        && this.props.identifyingNames.length > 0 &&
                            <Fragment>
                                <FontAwesome
                                    id="relayout-button"
                                    className="blue-button mr-2"
                                    name="refresh"
                                    spin={this.state.layouting}
                                    onClick={this.toggleLayouting}
                                />
                                <UncontrolledTooltip placement="bottom" target="relayout-button">
                                    Relayout
                                </UncontrolledTooltip>
                            </Fragment>
                        }
                        {!this.props.isMaximized &&
                            <FontAwesome
                                className="blue-button mr-2"
                                name="list"
                                onClick={this.props.toggleShowCorrespondentsAsList}
                            />
                        }
                        <FontAwesome
                            className="blue-button"
                            name={this.props.isMaximized ? 'times' : 'arrows-alt'}
                            onClick={this.props.toggleMaximize}
                        />
                    </div>
                </CardHeader>
                <CardBody>
                    {(this.props.isFetchingGraph || this.props.isFetchingCorrespondents) &&
                        <Spinner />
                    }
                    {!this.props.isFetchingGraph && this.props.hasGraphData
                        && this.props.graph.nodes.length > 0
                        && this.props.identifyingNames.length > 0
                        &&
                        <D3Network
                            style={{ zIndex: -999 }}
                            nodes={this.props.graph.nodes}
                            links={this.props.graph.links}
                            nodePositions={this.state.nodePositions}
                            searchId={4}
                            layouting={this.state.layouting}
                            eventListener={this.state.eventListener}
                        />
                    }
                    {!(this.props.isFetchingGraph || this.props.isFetchingCorrespondents)
                        && (this.props.identifyingNames.length === 0 || this.props.graph.nodes.length === 0)
                        && <span>No Graph to display.</span>
                    }
                    {this.props.senderRecipientEmailList.isFetching &&
                        <Spinner />
                    }
                    {this.props.senderRecipientEmailList.hasData &&
                        <ResultListModal
                            isOpen={this.state.resultListModalOpen}
                            toggleModalOpen={this.toggleResultListModalOpen}
                            results={this.props.senderRecipientEmailList.data}
                            isFetching={this.props.senderRecipientEmailList.isFetching}
                            hasData={this.props.senderRecipientEmailList.data}
                            senderEmail={this.props.senderRecipientEmailList.sender}
                            recipientEmail={this.props.senderRecipientEmailList.recipient}
                            hasRequestError={this.props.senderRecipientEmailList.hasRequestError}
                        />
                    }
                    {this.props.senderRecipientEmailList.hasRequestError &&
                    <Modal
                        isOpen={this.state.errorModalOpen}
                        toggle={this.toggleErrorModalOpen}
                        className="result-list-modal modal-lg"
                    >
                        <ModalHeader toggle={this.toggleErrorModalOpen}>Sender Recipient Email List</ModalHeader>
                        <ModalBody className="text-danger">
                            An error occurred while requesting the Sender Recipient Email List.
                        </ModalBody>
                    </Modal>
                    }
                </CardBody>
            </Card>
        );
    }
}

Graph.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    identifyingNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    requestGraph: PropTypes.func.isRequired,
    isFetchingGraph: PropTypes.bool.isRequired,
    hasGraphData: PropTypes.bool.isRequired,
    hasRequestError: PropTypes.bool.isRequired,
    globalFilter: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        topicThreshold: PropTypes.number.isRequired,
        selectedEmailClasses: PropTypes.array.isRequired,
    }).isRequired,
    graph: PropTypes.shape({
        nodes: PropTypes.array,
        links: PropTypes.array,
    }).isRequired,
    requestSenderRecipientEmailList: PropTypes.func.isRequired,
    senderRecipientEmailList: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            doc_id: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired,
            header: PropTypes.shape({
                subject: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    toggleMaximize: PropTypes.func.isRequired,
    isMaximized: PropTypes.bool.isRequired,
    toggleShowCorrespondentsAsList: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    isFetchingCorrespondents: PropTypes.bool.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Graph));
