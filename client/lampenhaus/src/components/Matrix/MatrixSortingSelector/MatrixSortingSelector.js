import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ButtonGroup, Button, FormGroup } from 'reactstrap';
import {
    setCombinedSorting,
    setSelectedOrder,
    setSelectedFirstOrder,
    setSelectedSecondOrder,
} from '../../../actions/matrixActions';
import './MatrixSortingSelector.css';

const groupedSortingOptions = [
    {
        value: 'community',
        name: 'Community',
    }, {
        value: 'role',
        name: 'Role',
    },
];

const individualSortingOptions = [
    {
        value: 'count',
        name: 'Number of Links',
    }, {
        value: 'identifying_name',
        name: 'Identifying Name',
    },
];

function createSingleSortingOptions() {
    const sortingOptions = groupedSortingOptions.concat(individualSortingOptions);
    return sortingOptions.map(opt => (
        <option
            key={opt.value.concat('-single')}
            value={opt.value}
        >
            {opt.name}
        </option>
    ));
}

function createFirstCombinedSortingOptions() {
    return groupedSortingOptions.map(opt => (
        <option
            key={opt.value.concat('-combined-first')}
            value={opt.value}
        >
            {opt.name}
        </option>
    ));
}

const mapStateToProps = state => ({
    selectedOrder: state.matrix.selectedOrder,
    selectedFirstOrder: state.matrix.selectedFirstOrder,
    selectedSecondOrder: state.matrix.selectedSecondOrder,
    combinedSorting: state.matrix.combinedSorting,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setCombinedSorting,
    setSelectedOrder,
    setSelectedFirstOrder,
    setSelectedSecondOrder,
}, dispatch);

class MatrixSortingSelector extends Component {
    createSecondCombinedSortingOptions() {
        const sortingOptions = groupedSortingOptions.concat(individualSortingOptions);
        return sortingOptions.map(opt => (
            <option
                key={opt.value.concat('-combined-second')}
                value={opt.value}
                disabled={this.props.selectedFirstOrder === opt.value}
            >
                {opt.name}
            </option>
        ));
    }

    render() {
        return (
            <div id="matrix-selection-container">
                <FormGroup check inline>
                    <ButtonGroup className="raw-toggle">
                        <Button
                            active={!this.props.combinedSorting}
                            onClick={() => this.props.setCombinedSorting(false)}
                        >
                            Single
                        </Button>
                        <Button
                            active={this.props.combinedSorting}
                            onClick={() => this.props.setCombinedSorting(true)}
                        >
                            Combined
                        </Button>
                    </ButtonGroup>
                </FormGroup>
                <div id="matrix-selection-container">
                    <span className="matrix-selection-text">Sort by</span>
                    <div>
                        {this.props.combinedSorting ?
                            <select
                                value={this.props.selectedFirstOrder}
                                onChange={event => this.props.setSelectedFirstOrder(event.target.value)}
                                className="first-selector"
                            >
                                {createFirstCombinedSortingOptions()}
                            </select> :
                            <select
                                value={this.props.selectedOrder}
                                onChange={event => this.props.setSelectedOrder(event.target.value)}
                                className="first-selector"
                            >
                                {createSingleSortingOptions()}
                            </select>
                        }
                        <span
                            className={
                                `matrix-selection-text ${(this.props.combinedSorting ? '' : 'disabled-selection-div')}`}
                        >
                            and
                        </span>
                        <select
                            className={this.props.combinedSorting ? '' : 'disabled-selection-div'}
                            value={this.props.selectedSecondOrder}
                            onChange={(event) => { this.props.setSelectedSecondOrder(event.target.value); }}
                        >
                            {this.createSecondCombinedSortingOptions()}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

MatrixSortingSelector.propTypes = {
    selectedOrder: PropTypes.string.isRequired,
    selectedFirstOrder: PropTypes.string.isRequired,
    selectedSecondOrder: PropTypes.string.isRequired,
    combinedSorting: PropTypes.bool.isRequired,
    setCombinedSorting: PropTypes.func.isRequired,
    setSelectedOrder: PropTypes.func.isRequired,
    setSelectedFirstOrder: PropTypes.func.isRequired,
    setSelectedSecondOrder: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MatrixSortingSelector);
