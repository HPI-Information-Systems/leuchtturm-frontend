import React, { Component } from 'react';
import { InputGroupText, InputGroup, Input, Button, Collapse } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import './SearchBar.css';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempSearchTerm: '',
            tempStartDate: '',
            tempEndDate: '',
            filtersOpen: false,
        };
        this.commitSearch = this.commitSearch.bind(this);
        this.commitFilters = this.commitFilters.bind(this);
        this.toggleFiltersOpen = this.toggleFiltersOpen.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.relevantPropsChanged(nextProps)) {
            this.state.tempSearchTerm = nextProps.searchTerm;
            this.state.tempStartDate = nextProps.startDate;
            this.state.tempEndDate = nextProps.endDate;
        }
    }

    onUpdateSearchTerm(tempSearchTerm) {
        this.setState({ tempSearchTerm });
    }

    onUpdateStartDate(tempStartDate) {
        this.setState({ tempStartDate });
    }

    onUpdateEndDate(tempEndDate) {
        this.setState({ tempEndDate });
    }

    toggleFiltersOpen() {
        this.setState({ filtersOpen: !this.state.filtersOpen });
    }

    relevantPropsChanged(nextProps) {
        return (
            this.props.searchTerm !== nextProps.searchTerm ||
            this.props.startDate !== nextProps.startDate ||
            this.props.endDate !== nextProps.endDate
        );
    }

    commitSearch() {
        this.commitFilters();
        this.props.updateBrowserSearchPath(this.state.tempSearchTerm);
    }

    commitFilters() {
        this.props.changeStartDateHandler(this.state.tempStartDate);
        this.props.changeEndDateHandler(this.state.tempEndDate);
    }

    render() {
        return (
            <React.Fragment>
                <InputGroup>
                    <Input
                        placeholder="Enter search term"
                        value={this.state.tempSearchTerm}
                        onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                        onChange={e => this.onUpdateSearchTerm(e.target.value)}
                    />
                    <Button
                        color="primary"
                        onClick={this.commitSearch}
                    >
                        Search
                    </Button>
                    <Button color="secondary" onClick={this.toggleFiltersOpen} >
                        <FontAwesome name={!this.state.filtersOpen ? 'caret-right' : 'caret-down'} className="mr-2" />
                        Filters
                    </Button>
                </InputGroup>
                <Collapse isOpen={this.state.filtersOpen}>
                    <InputGroup>
                        <InputGroupText>From:</InputGroupText>
                        <Input
                            type="date"
                            className="input-in-group-addon"
                            value={this.state.tempStartDate}
                            onKeyPress={e => e.key === 'Enter' && this.commitFilters()}
                            onChange={e => this.onUpdateStartDate(e.target.value)}
                        />
                        <InputGroupText>To:</InputGroupText>
                        <Input
                            type="date"
                            className="input-in-group-addon"
                            value={this.state.tempEndDate}
                            onKeyPress={e => e.key === 'Enter' && this.commitFilters()}
                            onChange={e => this.onUpdateEndDate(e.target.value)}
                        />
                        <Button
                            color="primary"
                            onClick={this.commitFilters}
                        >
                            Filter
                        </Button>
                    </InputGroup>
                    <InputGroup>
                        <InputGroupText>From:</InputGroupText>
                        <Input
                            type="date"
                            className="input-in-group-addon"
                            value={this.state.tempStartDate}
                            onKeyPress={e => e.key === 'Enter' && this.commitFilters()}
                            onChange={e => this.onUpdateStartDate(e.target.value)}
                        />
                        <InputGroupText>To:</InputGroupText>
                        <Input
                            type="date"
                            className="input-in-group-addon"
                            value={this.state.tempEndDate}
                            onKeyPress={e => e.key === 'Enter' && this.commitFilters()}
                            onChange={e => this.onUpdateEndDate(e.target.value)}
                        />
                        <Button
                            color="primary"
                            onClick={this.commitFilters}
                        >
                            Filter
                        </Button>
                    </InputGroup>
                </Collapse>
            </React.Fragment>
        );
    }
}

SearchBar.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    updateBrowserSearchPath: PropTypes.func.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    changeStartDateHandler: PropTypes.func.isRequired,
    changeEndDateHandler: PropTypes.func.isRequired,
};

export default SearchBar;
