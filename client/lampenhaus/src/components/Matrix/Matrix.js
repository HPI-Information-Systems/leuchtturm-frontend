import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
import { requestMatrix } from '../../actions/matrixActions';
import { requestSenderRecipientEmailList } from '../../actions/correspondentViewActions';
import MatrixSortingSelector from './MatrixSortingSelector/MatrixSortingSelector';
import ResultListModal from '../ResultListModal/ResultListModal';

const mapStateToProps = state => ({
    matrix: state.matrix.matrix,
    hasMatrixData: state.matrix.hasMatrixData,
    isFetchingMatrix: state.matrix.isFetchingMatrix,
    hasMatrixRequestError: state.matrix.hasMatrixRequestError,
    selectedOrder: state.matrix.selectedOrder,
    selectedFirstOrder: state.matrix.selectedFirstOrder,
    selectedSecondOrder: state.matrix.selectedSecondOrder,
    combinedSorting: state.matrix.combinedSorting,
    selectedColorOption: state.matrix.selectedColorOption,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    requestMatrix,
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
        this.eventListener = {};

        const self = this;
        this.eventListener.texts = {
            click: (identifyingName) => {
                this.props.history.push(`/correspondent/${identifyingName}`);
            },
        };
        this.eventListener.cells = {
            click(cell) {
                self.getSenderRecipientEmailListData(link.source.props.name, link.target.props.name);
            },
        };

        this.D3Matrix = new D3Matrix(this.matrixContainerId, this.eventListener);

        this.getSenderRecipientEmailListData = this.getSenderRecipientEmailListData.bind(this);
        this.toggleResultListModalOpen = this.toggleResultListModalOpen.bind(this);
        this.toggleErrorModalOpen = this.toggleErrorModalOpen.bind(this);
    }

    componentDidMount() {
        this.props.requestMatrix();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.matrixHighlighting.hasData
            && nextProps.maximized
            && (nextProps.matrixHighlighting.results !== this.props.matrixHighlighting.results)
            && nextProps.matrixHighlighting.results.length > 0
            && !this.props.isFetchingMatrix) {
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
        if (this.props.hasMatrixData
            && this.props.matrix.nodes.length > 0
            && (this.props.matrix !== lastProps.matrix || this.props.maximized !== lastProps.maximized)) {
            this.D3Matrix.updateMatrixContainerId(this.matrixContainerId);
            this.D3Matrix.createMatrix(this.props.matrix, this.props.maximized);
            if (this.props.combinedSorting) {
                this.D3Matrix.combinedSortMatrix(this.props.selectedFirstOrder, this.props.selectedSecondOrder);
            } else {
                this.D3Matrix.singleSortMatrix(this.props.selectedOrder);
            }
            this.D3Matrix.colorCells(this.props.selectedColorOption);
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

        if (this.props.isFetchingMatrix) {
            matrix = <Spinner />;
        } else if (this.props.hasMatrixData
            && this.props.matrix.nodes.length > 0) {
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
                    {this.props.hasMatrixData &&
                        <FontAwesome
                            className="pull-right blue-button"
                            name={this.props.maximized ? 'times' : 'arrows-alt'}
                            onClick={this.props.toggleMaximize}
                        />
                    }
                    {this.props.maximized &&
                     this.props.hasMatrixData &&
                     <MatrixSortingSelector />
                    }
                </CardHeader>
                {this.props.hasMatrixRequestError ?
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
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    toggleMaximize: PropTypes.func.isRequired,
    maximized: PropTypes.bool,
    requestMatrix: PropTypes.func.isRequired,
    matrix: PropTypes.shape({
        nodes: PropTypes.array,
        links: PropTypes.array,
    }).isRequired,
    isFetchingMatrix: PropTypes.bool.isRequired,
    hasMatrixRequestError: PropTypes.bool.isRequired,
    hasMatrixData: PropTypes.bool.isRequired,
    matrixHighlighting: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.array.isRequired,
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
