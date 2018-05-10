/* eslint-disable */
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

function createSortingOptions(selectedOrder, secondSelectedOrder=null) {
    return sortingOptions.map(opt => (
        <option
            value={opt.value}
            disabled={selectedOrder === opt.value || secondSelectedOrder === opt.value}
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
        // eslint-disable-next-line
        console.log(orderToSelect);
        // eslint-disable-next-line
        console.log(selectedValue);
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
        // eslint-disable-next-line
        console.log('toggle combinedSorting called');
        this.setState({ combinedSorting: !this.state.combinedSorting });
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
                    {createSortingOptions(this.state.selectedOrder)}
                </select>);
        } else {
            // eslint-disable-next-line
            console.log('combinedSorting:');
            // eslint-disable-next-line
            console.log(this.state.combinedSorting);
            selection = (
                <Fragment>
                    <span className="matrix-selection-text">First:</span>
                    <select 
                        id="order1"
                        value={this.state.selectedFirstOrder}
                        onChange={(event) => { this.setSelectedOrder(event.target.value, 'selectedFirstOrder'); }}
                    >
                        {createSortingOptions(this.state.selectedFirstOrder, this.state.selectedSecondOrder)}
                    </select>
                    <span className="matrix-selection-text">Second:</span>
                    <select 
                        id="order2"
                        value={this.state.selectedSecondOrder}
                        onChange={(event) => { this.setSelectedOrder(event.target.value, 'selectedSecondOrder'); }}
                    >
                        {createSortingOptions(this.state.selectedSecondOrder, this.state.selectedFirstOrder)}
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
                <strong className="matrix-selection-text">Sort by:</strong>
                <div id="matrix-selection-container">
                    {selection}
                </div>
            </div>
        );
    }
}

export default MatrixSortingSelector;
