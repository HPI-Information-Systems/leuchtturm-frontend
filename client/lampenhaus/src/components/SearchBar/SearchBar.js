import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';

class SearchBar extends Component {
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.updateBrowserSearchPath(this.props.search.searchTerm);
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
                <InputGroupAddon addonType="append">
                    <Button
                        color="primary"
                        onClick={() =>
                            this.props.updateBrowserSearchPath(this.props.search.searchTerm)
                        }
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
