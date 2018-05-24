import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Input, Label, FormGroup } from 'reactstrap';
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
        value: 'address',
        name: 'Email Address',
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

function getDisabledClass(otherSelection) {
    if (otherSelection) {
        return 'disabled-selection-div';
    }
    return '';
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
                    <Label check>
                        <Input
                            type="checkbox"
                            checked={this.props.combinedSorting}
                            onChange={() => { this.props.setCombinedSorting(!this.props.combinedSorting); }}
                        />{' '}
                        Combined Sorting
                    </Label>
                </FormGroup>
                <div id="matrix-selection-container">
                    <div className={getDisabledClass(this.props.combinedSorting)}>
                        <strong className="matrix-selection-text">Single Sort by:</strong>
                        <select
                            value={this.props.selectedOrder}
                            onChange={(event) => { this.props.setSelectedOrder(event.target.value); }}
                        >
                            {createSingleSortingOptions()}
                        </select>
                    </div>
                    <div className={getDisabledClass(!this.props.combinedSorting)}>
                        <strong className="ml-2 matrix-selection-text">Combined Sort by:</strong>
                        <select
                            value={this.props.selectedFirstOrder}
                            onChange={(event) => { this.props.setSelectedFirstOrder(event.target.value); }}
                        >
                            {createFirstCombinedSortingOptions()}
                        </select>
                        <span className="matrix-selection-text">And:</span>
                        <select
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
