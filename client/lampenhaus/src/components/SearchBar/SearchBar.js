import React, { Component } from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import PropTypes from 'prop-types';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newSearchTerm: '',
        };
        this.onUpdateSearchTerm = this.onUpdateSearchTerm.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.state.newSearchTerm = nextProps.searchTerm;
    }

    onUpdateSearchTerm(e) {
        this.setState({ newSearchTerm: e.target.value });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.props.updateBrowserSearchPath(this.state.newSearchTerm);
        }
    }

    render() {
        return (
            <InputGroup>
                <Input
                    onKeyPress={e => this.handleKeyPress(e)}
                    placeholder="Enter search term"
                    value={this.state.newSearchTerm}
                    onChange={this.onUpdateSearchTerm}
                />
                <InputGroupAddon addonType="append">
                    <Button
                        color="primary"
                        onClick={() =>
                            this.props.updateBrowserSearchPath(this.state.newSearchTerm)
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
};

export default SearchBar;
