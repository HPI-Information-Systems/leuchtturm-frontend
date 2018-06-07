import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
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
        this.matrixContainerId = 'mini-matrix-container';
        if (this.props.maximized) {
            this.props.requestMatrix();
            this.matrixContainerId = 'big-matrix-container';
        }
        this.D3Matrix = new D3Matrix(this.matrixContainerId, this.props.maximized);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.matrixHighlighting.hasData
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
            matrix = <div id={this.matrixContainerId} className="matrix-container" />;
        }

        let component = matrix;
        if (this.props.maximized) {
            component = (
                <Fragment>
                    <header>
                        <MatrixSortingSelector />
                    </header>
                    <section>
                        legend
                    </section>
                    <aside>
                        {matrix}
                    </aside>
                </Fragment>
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
                </CardHeader>
                <CardBody className={this.props.maximized ? '' : 'p-0'}>
                    {this.props.matrixHighlighting.hasRequestError &&
                        <span className="text-danger">
                            An error occurred while requesting the Matrix highlighting.
                        </span>
                    }
                    { component }
                </CardBody>
            </Card>
        );
    }
}

Matrix.defaultProps = {
    maximized: false,
};

Matrix.propTypes = {
    toggleMaximize: PropTypes.func.isRequired,
    maximized: PropTypes.bool,
    requestMatrix: PropTypes.func.isRequired,
    matrix: PropTypes.shape({
        nodes: PropTypes.array,
        links: PropTypes.array,
    }).isRequired,
    isFetchingMatrix: PropTypes.bool.isRequired,
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
    combinedSorting: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Matrix);
