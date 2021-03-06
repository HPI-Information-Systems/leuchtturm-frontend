import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
    FormGroup,
    ButtonGroup,
    Button,
    UncontrolledDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap';
import {
    setCombinedSorting,
    setSelectedOrder,
    setSelectedFirstOrder,
    setSelectedSecondOrder,
    setSelectedColorOption,
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

function getSortingName(sortingValue) {
    const sortingOptions = groupedSortingOptions.concat(individualSortingOptions);
    const sortingOption = sortingOptions.find(opt => opt.value === sortingValue);
    return sortingOption ? sortingOption.name : 'Unknown';
}

const mapStateToProps = state => ({
    selectedOrder: state.matrix.selectedOrder,
    selectedFirstOrder: state.matrix.selectedFirstOrder,
    selectedSecondOrder: state.matrix.selectedSecondOrder,
    combinedSorting: state.matrix.combinedSorting,
    selectedColorOption: state.matrix.selectedColorOption,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setCombinedSorting,
    setSelectedOrder,
    setSelectedFirstOrder,
    setSelectedSecondOrder,
    setSelectedColorOption,
}, dispatch);

class MatrixSortingSelector extends Component {
    createSingleSortingOptions() {
        const sortingOptions = groupedSortingOptions.concat(individualSortingOptions);
        return sortingOptions.map(opt => (
            <DropdownItem
                key={opt.value.concat('-single')}
                onClick={() => this.props.setSelectedOrder(opt.value)}
            >
                {opt.name}
            </DropdownItem>
        ));
    }

    createFirstCombinedSortingOptions() {
        return groupedSortingOptions.map(opt => (
            <DropdownItem
                key={opt.value.concat('-combined-first')}
                onClick={() => this.props.setSelectedFirstOrder(opt.value)}
            >
                {opt.name}
            </DropdownItem>
        ));
    }

    createSecondCombinedSortingOptions() {
        const sortingOptions = groupedSortingOptions.concat(individualSortingOptions);
        return sortingOptions.map(opt => (
            <DropdownItem
                key={opt.value.concat('-combined-second')}
                onClick={() => this.props.setSelectedSecondOrder(opt.value)}
                disabled={this.props.selectedFirstOrder === opt.value}
            >
                {opt.name}
            </DropdownItem>
        ));
    }

    createColorOptions() {
        return groupedSortingOptions.map(opt => (
            <DropdownItem
                key={opt.value.concat('-color')}
                onClick={() => this.props.setSelectedColorOption(opt.value)}
            >
                {opt.name}
            </DropdownItem>
        ));
    }

    render() {
        return (
            <FormGroup className="pull-right" check inline>
                <span className="matrix-selection-text">Color by</span>
                <UncontrolledDropdown className="form-inline card-header-dropdown" size="sm">
                    <DropdownToggle className="sorting-selector" caret>
                        {getSortingName(this.props.selectedColorOption)}
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.createColorOptions()}
                    </DropdownMenu>
                </UncontrolledDropdown>
                <span className="matrix-selection-text">Sorting Mode</span>
                <ButtonGroup size="sm" className="raw-toggle form-inline">
                    <Button
                        className="card-header-dropdown pt-0"
                        active={!this.props.combinedSorting}
                        onClick={() => this.props.setCombinedSorting(false)}
                    >
                        Single
                    </Button>
                    <Button
                        className="card-header-dropdown pt-0"
                        active={this.props.combinedSorting}
                        onClick={() => this.props.setCombinedSorting(true)}
                    >
                        Combined
                    </Button>
                </ButtonGroup>
                <span className="matrix-selection-text">Sort by</span>
                {this.props.combinedSorting ?
                    <UncontrolledDropdown className="form-inline card-header-dropdown" size="sm">
                        <DropdownToggle className="sorting-selector" caret>
                            {getSortingName(this.props.selectedFirstOrder)}
                        </DropdownToggle>
                        <DropdownMenu>
                            {this.createFirstCombinedSortingOptions()}
                        </DropdownMenu>
                    </UncontrolledDropdown> :
                    <UncontrolledDropdown className="form-inline card-header-dropdown" size="sm">
                        <DropdownToggle className="sorting-selector" caret>
                            {getSortingName(this.props.selectedOrder)}
                        </DropdownToggle>
                        <DropdownMenu>
                            {this.createSingleSortingOptions()}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                }
                <span
                    className={
                        `matrix-selection-text ${(this.props.combinedSorting ? '' : 'disabled-selection-div')}`}
                >
                    and
                </span>
                <UncontrolledDropdown className="form-inline card-header-dropdown" size="sm">
                    <DropdownToggle
                        className={this.props.combinedSorting
                            ? 'sorting-selector'
                            : 'sorting-selector disabled-selection-div'}
                        caret
                    >
                        {getSortingName(this.props.selectedSecondOrder)}
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.createSecondCombinedSortingOptions()}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </FormGroup>
        );
    }
}

MatrixSortingSelector.propTypes = {
    selectedOrder: PropTypes.string.isRequired,
    selectedFirstOrder: PropTypes.string.isRequired,
    selectedSecondOrder: PropTypes.string.isRequired,
    selectedColorOption: PropTypes.string.isRequired,
    combinedSorting: PropTypes.bool.isRequired,
    setCombinedSorting: PropTypes.func.isRequired,
    setSelectedOrder: PropTypes.func.isRequired,
    setSelectedFirstOrder: PropTypes.func.isRequired,
    setSelectedSecondOrder: PropTypes.func.isRequired,
    setSelectedColorOption: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MatrixSortingSelector);
