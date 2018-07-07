import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import {
    Card,
    CardBody,
    CardHeader,
    Modal,
    ModalHeader,
    ModalBody,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import './Matrix.css';
import D3Matrix from './D3Matrix';
import Spinner from '../Spinner/Spinner';
import { requestSenderRecipientEmailList } from '../../actions/correspondentViewActions';
import MatrixSortingSelector from './MatrixSortingSelector/MatrixSortingSelector';
import ResultListModal from '../ResultListModal/ResultListModal';

const mapStateToProps = state => ({
    selectedOrder: state.matrix.selectedOrder,
    selectedFirstOrder: state.matrix.selectedFirstOrder,
    selectedSecondOrder: state.matrix.selectedSecondOrder,
    combinedSorting: state.matrix.combinedSorting,
    selectedColorOption: state.matrix.selectedColorOption,
    senderRecipientEmailList: state.correspondentView.senderRecipientEmailList,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    requestSenderRecipientEmailList,
}, dispatch);

class Matrix extends Component {
    constructor(props) {
        super(props);
        this.matrixContainerId = 'matrix-container';
        this.state = {
            resultListModalOpen: false,
            errorModalOpen: true,
        };

        this.getSenderRecipientEmailListData = this.getSenderRecipientEmailListData.bind(this);
        this.toggleResultListModalOpen = this.toggleResultListModalOpen.bind(this);
        this.toggleErrorModalOpen = this.toggleErrorModalOpen.bind(this);

        this.eventListener = {};
        this.eventListener.texts = {
            click: (identifyingName) => {
                this.props.history.push(`/correspondent/${identifyingName}`);
            },
        };
        this.eventListener.cells = {
            click: (cellSource, cellTarget) => {
                this.getSenderRecipientEmailListData(cellSource, cellTarget);
            },
        };
        this.D3Matrix = new D3Matrix(this.matrixContainerId, this.eventListener);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.matrixHighlighting.hasData
            && !_.isEqual(nextProps.matrixHighlighting.results, this.props.matrixHighlighting.results)
            && nextProps.matrixHighlighting.results.length > 0
            && !nextProps.matrix.isFetching) {
            this.D3Matrix.highlightMatrix(nextProps.matrixHighlighting.results);
        }

        if ((this.props.combinedSorting && !nextProps.combinedSorting)
            || (!nextProps.combinedSorting && (nextProps.selectedOrder !== this.props.selectedOrder))) {
            this.D3Matrix.singleSortMatrix(nextProps.selectedOrder);
        }
        if ((!this.props.combinedSorting && nextProps.combinedSorting)
            || (nextProps.combinedSorting
            && (nextProps.selectedFirstOrder !== this.props.selectedFirstOrder
            || nextProps.selectedSecondOrder !== this.props.selectedSecondOrder))) {
            this.D3Matrix.combinedSortMatrix(nextProps.selectedFirstOrder, nextProps.selectedSecondOrder);
        }
    }

    componentDidUpdate(lastProps) {
        if (this.props.matrix.hasData
            && this.props.matrix.results.nodes.length > 0
            && (!_.isEqual(this.props.matrix.results, lastProps.matrix.results)
                || this.props.maximized !== lastProps.maximized)) {
            this.D3Matrix.updateMatrixContainerId(this.matrixContainerId);
            this.D3Matrix.createMatrix(this.props.matrix.results, this.props.maximized);
            if (this.props.combinedSorting) {
                this.D3Matrix.combinedSortMatrix(this.props.selectedFirstOrder, this.props.selectedSecondOrder);
            } else {
                this.D3Matrix.singleSortMatrix(this.props.selectedOrder);
            }
            this.D3Matrix.colorCells(this.props.selectedColorOption);
            if (this.props.matrixHighlighting.hasData
                && this.props.matrixHighlighting.results.length > 0
                && !this.props.matrix.isFetching) {
                this.D3Matrix.highlightMatrix(this.props.matrixHighlighting.results);
            }
        }
        if (this.props.selectedColorOption !== lastProps.selectedColorOption) {
            this.D3Matrix.createLegend(this.props.selectedColorOption);
            this.D3Matrix.colorCells(this.props.selectedColorOption);
        }
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

    render() {
        let matrix = <span>No Matrix to display.</span>;

        if (this.props.matrix.isFetching || this.props.isFetchingCorrespondents) {
            matrix = <Spinner />;
        } else if (this.props.matrix.hasData
            && this.props.matrix.results.nodes.length > 0) {
            matrix = (
                <div
                    id={this.matrixContainerId}
                    className={this.props.maximized ? 'matrix-container' : 'matrix-container minimized'}
                />
            );
        }

        let component = matrix;
        if (this.props.maximized) {
            component = (
                <div id="matrix-flex-container" >
                    <div id="matrix-legend-container" />
                    {matrix}
                </div>
            );
        }

        return (
            <Card className={this.props.maximized ? 'maxi-matrix-card' : 'mini-matrix-card'}>
                <CardHeader tag="h4">
                    Communication Patterns
                    {this.props.matrix.hasData &&
                        <FontAwesome
                            className="pull-right blue-button"
                            name={this.props.maximized ? 'times' : 'arrows-alt'}
                            onClick={this.props.toggleMaximize}
                        />
                    }
                    {this.props.maximized &&
                     this.props.matrix.hasData &&
                     <MatrixSortingSelector />
                    }
                </CardHeader>
                {this.props.matrix.hasRequestError ?
                    <CardBody className="text-danger">
                        An error occurred while requesting the Matrix.
                    </CardBody>
                    :
                    <CardBody>
                        {this.props.matrixHighlighting.hasRequestError &&
                            <span className="text-danger">
                                An error occurred while requesting the Matrix highlighting.
                            </span>
                        }
                        { component }
                        {(this.props.senderRecipientEmailList.isFetching || this.props.isFetchingCorrespondents) &&
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
                                <ModalHeader
                                    toggle={this.toggleErrorModalOpen}
                                >
                                    Sender Recipient Email List
                                </ModalHeader>
                                <ModalBody className="text-danger">
                                    An error occurred while requesting the Sender Recipient Email List.
                                </ModalBody>
                            </Modal>
                        }
                    </CardBody>}
            </Card>
        );
    }
}

Matrix.defaultProps = {
    maximized: false,
};

Matrix.propTypes = {
    isFetchingCorrespondents: PropTypes.bool.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    toggleMaximize: PropTypes.func.isRequired,
    maximized: PropTypes.bool,
    matrixHighlighting: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.array.isRequired,
        hasData: PropTypes.bool.isRequired,
    }).isRequired,
    matrix: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.shape({
            nodes: PropTypes.array.isRequired,
            links: PropTypes.array.isRequired,
        }).isRequired,
        hasData: PropTypes.bool.isRequired,
    }).isRequired,
    selectedOrder: PropTypes.string.isRequired,
    selectedFirstOrder: PropTypes.string.isRequired,
    selectedSecondOrder: PropTypes.string.isRequired,
    selectedColorOption: PropTypes.string.isRequired,
    combinedSorting: PropTypes.bool.isRequired,
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
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Matrix));
