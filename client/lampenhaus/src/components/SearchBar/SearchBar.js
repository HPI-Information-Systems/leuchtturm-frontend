import React, { Component } from 'react';
import { InputGroupText, InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
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

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.commitSearch();
        }
    }

    commitSearch() {
        this.props.changeStartDateHandler(this.state.tempStartDate);
        this.props.changeEndDateHandler(this.state.tempEndDate);
        this.props.updateBrowserSearchPath(this.state.tempSearchTerm);
    }

    render() {
        return (
            <InputGroup
                onKeyPress={e => this.handleKeyPress(e)}
            >
                <Input
                    placeholder="Enter search term"
                    value={this.state.tempSearchTerm}
                    onChange={e => this.onUpdateSearchTerm(e.target.value)}
                />
                <InputGroupAddon addonType="append">
                    <InputGroupText>From:</InputGroupText>
                    <Input
                        type="date"
                        className="input-in-group-addon"
                        value={this.state.tempStartDate}
                        onChange={e => this.onUpdateStartDate(e.target.value)}
                    />
                    <InputGroupText>To:</InputGroupText>
                    <Input
                        type="date"
                        className="input-in-group-addon"
                        value={this.state.tempEndDate}
                        onChange={e => this.onUpdateEndDate(e.target.value)}
                    />
                    <Button
                        color="primary"
                        onClick={this.commitSearch}
                    >
                        Search
                    </Button>
                </InputGroupAddon>
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
