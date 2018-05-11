import React, { Fragment, Component } from 'react';
import { Input, Label, FormGroup } from 'reactstrap';
import './MatrixSortingSelector.css';

const groupedSortingOptions = [
    {
        value: 'community',
        name: 'Community',
    }, {
        value: 'role',
        name: 'Role',
    }, {
        value: 'domain',
        name: 'Email Domain',
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

    setSelectedOrder(selectedValue, orderToSelect) {
        switch (orderToSelect) {
        case 'selectedOrder':
            this.setState({ selectedOrder: selectedValue });
            break;
        case 'selectedFirstOrder':
            this.setState({ selectedFirstOrder: selectedValue });
            break;
        case 'selectedSecondOrder':
            this.setState({ selectedSecondOrder: selectedValue });
            break;
        default:
            break;
        }
    }

    toggleCombinedSorting() {
        this.setState({ combinedSorting: !this.state.combinedSorting });
    }

    createSecondCombinedSortingOptions() {
        const sortingOptions = groupedSortingOptions.concat(individualSortingOptions);
        return sortingOptions.map(opt => (
            <option
                key={opt.value.concat('-combined-second')}
                value={opt.value}
                disabled={this.state.selectedFirstOrder === opt.value}
            >
                {opt.name}
            </option>
        ));
    }

    render() {
        let selection = <span>Sorting not available</span>;
        if (!this.state.combinedSorting) {
            selection = (
                <select
                    id="order"
                    value={this.state.selectedOrder}
                    onChange={(event) => { this.setSelectedOrder(event.target.value, 'selectedOrder'); }}
                >
                    {createSingleSortingOptions()}
                </select>);
        } else {
            selection = (
                <Fragment>
                    <span className="matrix-selection-text">First:</span>
                    <select
                        id="order1"
                        value={this.state.selectedFirstOrder}
                        onChange={(event) => { this.setSelectedOrder(event.target.value, 'selectedFirstOrder'); }}
                    >
                        {createFirstCombinedSortingOptions()}
                    </select>
                    <span className="matrix-selection-text">Second:</span>
                    <select
                        id="order2"
                        value={this.state.selectedSecondOrder}
                        onChange={(event) => { this.setSelectedOrder(event.target.value, 'selectedSecondOrder'); }}
                    >
                        {this.createSecondCombinedSortingOptions()}
                    </select>
                </Fragment>
            );
        }

        return (
            <div id="matrix-selection-container">
                <FormGroup check inline>
                    <Label check>
                        <Input
                            type="checkbox"
                            checked={this.state.combinedSorting}
                            onChange={() => { this.toggleCombinedSorting(); }}
                        />{' '}
                        Combined Sorting
                    </Label>
                </FormGroup>
                <strong className="matrix-selection-text">Sort by:</strong>
                <div id="matrix-selection-container">
                    {selection}
                </div>
            </div>
        );
    }
}

export default MatrixSortingSelector;
