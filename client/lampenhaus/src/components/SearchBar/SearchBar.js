import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
        };
        this.onUpdateSearchTerm = this.onUpdateSearchTerm.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.state.searchTerm = nextProps.search.searchTerm;
    }

    onUpdateSearchTerm(e) {
        this.setState({ searchTerm: e.target.value });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.updateBrowserSearchPath(this.state.searchTerm);
        }
    }

    render() {
        return (
            <InputGroup>
                <Input
                    onKeyPress={e => this.handleKeyPress(e)}
                    placeholder="Enter search term"
                    value={this.state.searchTerm}
                    onChange={this.onUpdateSearchTerm}
                />
                <InputGroupAddon>
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
