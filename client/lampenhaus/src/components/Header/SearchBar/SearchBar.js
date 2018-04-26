import React, { Component } from 'react';
import {
    Col,
    InputGroup,
    Input,
    Button,
    Collapse,
    Form,
    FormGroup,
    Label,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersOpen: false,
            filters: {
                searchTerm: '',
                startDate: '',
                endDate: '',
                topicsSelected: [],
                isBusinessSelected: false,
                isPrivateSelected: false,
                isSpamSelected: false,
            },
        };
        this.commitSearch = this.commitSearch.bind(this);
        this.toggleFiltersOpen = this.toggleFiltersOpen.bind(this);
        this.handleFiltersChange = this.handleFiltersChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.relevantPropsChanged(nextProps)) {
            this.state.filters.searchTerm = nextProps.searchTerm;
            this.state.filters.startDate = nextProps.startDate;
            this.state.filters.endDate = nextProps.endDate;
        }
    }

    relevantPropsChanged(nextProps) {
        return (
            this.props.searchTerm !== nextProps.searchTerm ||
            this.props.startDate !== nextProps.startDate ||
            this.props.endDate !== nextProps.endDate
        );
    }

    toggleFiltersOpen() {
        this.setState({ filtersOpen: !this.state.filtersOpen });
    }

    handleFiltersChange(event) {
        const { target } = event;
        const { name } = target;

        let value;
        if (target.type === 'select-multiple') {
            value = [...event.target.options].filter(o => o.selected).map(o => o.value);
        } else {
            value = target.type === 'checkbox' ? target.checked : target.value;
        }

        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                [name]: value,
            },
        }));
    }

    commitSearch() {
        this.commitFilters();
        this.props.updateBrowserSearchPath(this.state.filters.searchTerm);
    }

    commitFilters() {
        this.props.changeStartDateHandler(this.state.filters.startDate);
        this.props.changeEndDateHandler(this.state.filters.endDate);
    }

    render() {
        return (
            <React.Fragment>
                <InputGroup>
                    <Input
                        type="text"
                        name="searchTerm"
                        placeholder="Enter search term"
                        value={this.state.filters.searchTerm}
                        onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                        onChange={this.handleFiltersChange}
                    />
                    <Button color="primary" onClick={this.commitSearch} className="mr-2">Search</Button>
                    <Button color="secondary" onClick={this.toggleFiltersOpen}>
                        <FontAwesome
                            name={!this.state.filtersOpen ? 'caret-right' : 'caret-down'}
                            className="mr-2"
                        />
                        Filters
                    </Button>
                </InputGroup>
                <Collapse isOpen={this.state.filtersOpen}>
                    <Form>
                        <FormGroup row>
                            <Label sm={2}>Date</Label>
                            <Label sm={1} for="from">From</Label>
                            <Col sm={4}>
                                <Input
                                    type="date"
                                    name="startDate"
                                    id="from"
                                    value={this.state.filters.startDate}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleFiltersChange}
                                />
                            </Col>
                            <Label sm={1} for="to">To</Label>
                            <Col sm={4}>
                                <Input
                                    type="date"
                                    name="endDate"
                                    id="to"
                                    value={this.state.filters.endDate}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleFiltersChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="topics" sm={2}>Topics</Label>
                            <Col sm={10}>
                                <Input
                                    type="select"
                                    name="topicsSelected"
                                    id="topics"
                                    multiple
                                    value={this.state.filters.topicsSelected}
                                    onChange={this.handleFiltersChange}
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Classes</Label>
                            <Col sm={10}>
                                <FormGroup check inline>
                                    <Label check>
                                        <Input
                                            name="isBusinessSelected"
                                            type="checkbox"
                                            checked={this.state.filters.isBusinessSelected}
                                            onChange={this.handleFiltersChange}
                                        /> Business
                                    </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Label check>
                                        <Input
                                            name="isPrivateSelected"
                                            type="checkbox"
                                            checked={this.state.filters.isPrivateSelected}
                                            onChange={this.handleFiltersChange}
                                        /> Private
                                    </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Label check>
                                        <Input
                                            name="isSpamSelected"
                                            type="checkbox"
                                            checked={this.state.filters.isSpamSelected}
                                            onChange={this.handleFiltersChange}
                                        /> Spam
                                    </Label>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                    </Form>
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
