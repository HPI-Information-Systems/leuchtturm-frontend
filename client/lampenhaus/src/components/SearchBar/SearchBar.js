import React, { Component } from 'react';
import { InputGroup, InputGroupButton, Input } from 'reactstrap';
import PropTypes from 'prop-types';

class SearchBar extends Component {
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.fullTextSearch(
                this.props.search.searchTerm,
                this.props.search.resultsPerPage,
            );
        }
    }

    render() {
        return (
            <InputGroup>
                <Input
                    onKeyPress={e => this.handleKeyPress(e)}
                    placeholder="Enter search term"
                    value={this.props.searchTerm || ''}
                    onChange={this.props.onUpdateSearchTerm}
                />
                <InputGroupButton
                    color="primary"
                    onClick={() =>
                        this.props.fullTextSearch(
                            this.props.search.searchTerm,
                            this.props.search.resultsPerPage,
                        )
                    }
                >
                    Search
                </InputGroupButton>
            </InputGroup>
        );
    }
}

SearchBar.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    fullTextSearch: PropTypes.func.isRequired,
    onUpdateSearchTerm: PropTypes.func.isRequired,
    search: PropTypes.shape({
        searchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasData: PropTypes.bool,
        numberOfResults: PropTypes.number,
        isFetching: PropTypes.bool,
        results: PropTypes.array,
        activePageNumber: PropTypes.number,
    }).isRequired,
};

export default SearchBar;
