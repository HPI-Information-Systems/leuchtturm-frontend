import React, { Component } from 'react';
import { InputGroupText, InputGroup, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import './SearchBar.css';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempSearchTerm: '',
            tempStartDate: '',
            tempEndDate: '',
        };
        this.commitSearch = this.commitSearch.bind(this);
        this.commitFilters = this.commitFilters.bind(this);
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
