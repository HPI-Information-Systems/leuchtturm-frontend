import React, { Fragment, Component } from 'react';
import { Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Matrix.css';
import { createMatrix } from './matrix-view';
import Spinner from '../Spinner/Spinner';
import * as actions from '../../actions/actions';

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
        this.state = {
            correspondents: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.correspondents !== this.state.correspondents
            && nextProps.correspondents.length > 0
            && !this.props.isFetchingMatrix) {
            this.setState({ correspondents: nextProps.correspondents });
            this.props.requestMatrix(nextProps.correspondents);
        }
    }

    componentDidUpdate() {
        if (this.props.hasMatrixData
            && this.props.matrix.nodes.length > 0) {
            createMatrix(this.props.matrix);
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
                    <Row className="mb-3 mt-1">
                        <Col>
                            <div id="matrix-selection-container">
                                <span id="matrix-selection-text">Sort by:</span>
                                <select id="order">
                                    <option value="address">By Email Address</option>
                                    <option value="domain">By Email Domain</option>
                                    <option value="count">By Number of Links</option>
                                    <option value="id">By Neo-ID</option>
                                </select>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="pl-0">
                            <div id="matrix-container" />
                        </Col>
                    </Row>
                    <script type="text/javascript" src="matrix-view.js" />
                </Fragment>);
        }

        return (
            matrix
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
    correspondents: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Matrix);
