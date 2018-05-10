import React, { Fragment, Component } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Matrix.css';
import { createMatrix, highlightMatrix } from './matrix-view';
import Spinner from '../Spinner/Spinner';
import * as actions from '../../actions/actions';
import MatrixSortingSelector from './MatrixSortingSelector/MatrixSortingSelector';

const mapStateToProps = state => ({
    matrix: state.matrix.matrix,
    hasMatrixData: state.matrix.hasMatrixData,
    isFetchingMatrix: state.matrix.isFetchingMatrix,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    requestMatrix: actions.requestMatrix,
}, dispatch);

class Matrix extends Component {
    constructor(props) {
        super(props);
        this.props.requestMatrix();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.matrixHighlighting && (nextProps.matrixHighlighting !== this.props.matrixHighlighting)
            && nextProps.matrixHighlighting.length > 0
            && !this.props.isFetchingMatrix
            && this.builtMatrix) {
            highlightMatrix(nextProps.matrixHighlighting, this.builtMatrix);
        }
    }

    componentDidUpdate() {
        if (this.props.hasMatrixData
            && this.props.matrix.nodes.length > 0
            && !this.builtMatrix) {
            this.builtMatrix = createMatrix(this.props.matrix);
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
                    <script type="text/javascript" src="matrix-view.js" />
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
    matrixHighlighting: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Matrix);
