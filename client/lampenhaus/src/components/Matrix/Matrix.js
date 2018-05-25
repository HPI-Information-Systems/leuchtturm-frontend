import React, { Fragment, Component } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Matrix.css';
import D3Matrix from './D3Matrix';
import Spinner from '../Spinner/Spinner';
import { requestMatrix } from '../../actions/matrixActions';
import MatrixSortingSelector from './MatrixSortingSelector/MatrixSortingSelector';

const mapStateToProps = state => ({
    matrix: state.matrix.matrix,
    hasMatrixData: state.matrix.hasMatrixData,
    isFetchingMatrix: state.matrix.isFetchingMatrix,
    selectedOrder: state.matrix.selectedOrder,
    selectedFirstOrder: state.matrix.selectedFirstOrder,
    selectedSecondOrder: state.matrix.selectedSecondOrder,
    combinedSorting: state.matrix.combinedSorting,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    requestMatrix,
}, dispatch);

class Matrix extends Component {
    constructor(props) {
        super(props);
        this.props.requestMatrix();
        this.D3Matrix = new D3Matrix('#matrix-container');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.matrixHighlighting
            && (nextProps.matrixHighlighting !== this.props.matrixHighlighting)
            && nextProps.matrixHighlighting.length > 0
            && !this.props.isFetchingMatrix) {
            this.D3Matrix.highlightMatrix(nextProps.matrixHighlighting);
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

    componentDidUpdate(lastprops) {
        if (this.props.hasMatrixData
            && this.props.matrix.nodes.length > 0
            && this.props.matrix !== lastprops.matrix) {
            this.D3Matrix.createMatrix(this.props.matrix);
        }
    }

    render() {
        let matrix = <span>No Matrix to display.</span>;

        if (this.props.isFetchingMatrix) {
            matrix = <Spinner />;
        } else if (this.props.hasMatrixData
            && this.props.matrix.nodes.length > 0) {
            matrix = (
                <Fragment>
                    <Row>
                        <Col className="pl-0">
                            <div id="matrix-container" />
                        </Col>
                    </Row>
                </Fragment>);
        }

        return (
            <Fragment>
                <Row className="mb-3 mt-1">
                    <Col>
                        <MatrixSortingSelector />
                    </Col>
                </Row>
                {matrix}
            </Fragment>
        );
    }
}

Matrix.propTypes = {
    requestMatrix: PropTypes.func.isRequired,
    matrix: PropTypes.shape({
        nodes: PropTypes.array,
        links: PropTypes.array,
    }).isRequired,
    isFetchingMatrix: PropTypes.bool.isRequired,
    hasMatrixData: PropTypes.bool.isRequired,
    matrixHighlighting: PropTypes.arrayOf(PropTypes.shape({
        source: PropTypes.string,
        target: PropTypes.string,
    })).isRequired,
    selectedOrder: PropTypes.string.isRequired,
    selectedFirstOrder: PropTypes.string.isRequired,
    selectedSecondOrder: PropTypes.string.isRequired,
    combinedSorting: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Matrix);