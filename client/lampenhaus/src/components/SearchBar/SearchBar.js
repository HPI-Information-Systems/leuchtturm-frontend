import React, { Component } from 'react';
import { InputGroup, InputGroupButton, Input } from 'reactstrap';

class SearchBar extends Component {
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.onSubmitSearch();
        }
    }

    render() {
        return (
            <InputGroup>
                <Input
                    onKeyPress={e => this.handleKeyPress(e)}
                    placeholder="Ken Lay"
                    value={this.props.searchTerm || ''}
                    onChange={this.props.onPageNumberChange}
                />
                <InputGroupButton color="primary" onClick={this.props.onSubmitSearch}>
                    Search
                </InputGroupButton>
            </InputGroup>
        );
    }
}

export default SearchBar;
