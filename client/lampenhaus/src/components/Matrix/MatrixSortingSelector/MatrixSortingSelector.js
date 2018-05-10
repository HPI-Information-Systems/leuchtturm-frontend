import React, { Fragment, Component } from 'react';
import { Button } from 'reactstrap';
import './MatrixSortingSelector.css';

const sortingOptions = [
    {
        value: 'community',
        name: 'Community',
    }, {
        value: 'role',
        name: 'Role',
    }, {
        value: 'count',
        name: 'Number of Links',
    }, {
        value: 'address',
        name: 'Email Address',
    }, {
        value: 'domain',
        name: 'Email Domain',
    },
];

function createSortingOptions(selectedOrder) {
    return sortingOptions.map(opt => (
        <option
            value={opt.value}
            disabled={selectedOrder === opt.value}
        >
            {opt.name}
        </option>
    ));
}

class MatrixSortingSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOrder: 'community',
            selectedFirstOrder: 'community',
            selectedSecondOrder: 'address',
            combinedSorting: false,
        };
    }

    toggleCombinedSorting() {
        this.setState({ combinedSorting: !this.state.combinedSorting });
    }

    render() {
        let selection = <span>Sorting not available</span>;
        if (this.state.combinedSorting) {
            selection = (
                <select id="order" value={this.state.selectedOrder}>
                    {createSortingOptions(this.state.selectedOrder)}
                </select>);
        } else {
            selection = (
                <Fragment>
                    <span className="matrix-selection-text">First:</span>
                    <select id="order1" value={this.state.selectedFirstOrder}>
                        {createSortingOptions(this.state.selectedFirstOrder)}
                    </select>
                    <span className="matrix-selection-text">Second:</span>
                    <select id="order2" value={this.state.selectedSecondOrder}>
                        {createSortingOptions(this.state.selectedSecondOrder)}
                    </select>
                </Fragment>
            );
        }

        return (
            <div id="matrix-selection-container">
                <Button
                    className="ml-2"
                    color="primary"
                    active={this.state.combinedSorting}
                    onClick={() => { this.toggleCombinedSorting(); }}
                >
                    Combined Sorting
                </Button>
                <strong>Sort by:</strong>
                <div id="matrix-selection-container">
                    {selection}
                </div>
            </div>
        );
    }
}

export default MatrixSortingSelector;
