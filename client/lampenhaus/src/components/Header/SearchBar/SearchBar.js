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
                    <Button color="primary" onClick={this.commitSearch}>Search</Button>
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
                            <Col sm={10}>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label for="from" className="mr-sm-2">From</Label>
                                    <Input
                                        type="date"
                                        name="from"
                                        id="from"
                                        className="input-in-group-addon"
                                        value={this.state.tempStartDate}
                                        onKeyPress={e => e.key === 'Enter' && this.commitFilters()}
                                        onChange={e => this.onUpdateStartDate(e.target.value)}
                                    />
                                </FormGroup>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label for="id" className="mr-sm-2">To</Label>
                                    <Input
                                        type="date"
                                        name="to"
                                        id="to"
                                        className="input-in-group-addon"
                                        value={this.state.tempEndDate}
                                        onKeyPress={e => e.key === 'Enter' && this.commitFilters()}
                                        onChange={e => this.onUpdateEndDate(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="exampleSelectMulti" sm={2}>Topics</Label>
                            <Col sm={10}>
                                <Input type="select" name="selectMulti" id="exampleSelectMulti" multiple />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="checkbox2" sm={2}>Classes</Label>
                            <Col sm={{ size: 10 }}>
                                <FormGroup check inline>
                                    <Label check>
                                        <Input type="checkbox" /> Business
                                    </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Label check>
                                        <Input type="checkbox" /> Private
                                    </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                    <Label check>
                                        <Input type="checkbox" /> Spam
                                    </Label>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 10, offset: 2 }}>
                                <Button color="primary" onClick={this.commitFilters} >
                                    Filter
                                </Button>
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
