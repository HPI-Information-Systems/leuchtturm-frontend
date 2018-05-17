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
import _ from 'lodash';
import getStandardGlobalFilter from '../../../utils/getStandardGlobalFilter';
import './SearchBar.css';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersOpen: false,
            globalFilter: getStandardGlobalFilter(),
        };
        this.commitSearch = this.commitSearch.bind(this);
        this.commitFilters = this.commitFilters.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.toggleFiltersOpen = this.toggleFiltersOpen.bind(this);
        this.fillDatesStandard = this.fillDatesStandard.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEmailClassesInputChange = this.handleEmailClassesInputChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.state.globalFilter, nextProps.globalFilter)) {
            this.setState({ globalFilter: nextProps.globalFilter });
        }
    }

    commitSearch() {
        this.commitFilters();
        this.props.updateBrowserSearchPath(this.state.globalFilter.searchTerm);
    }

    commitFilters() {
        this.props.handleGlobalFilterChange(this.state.globalFilter);
    }

    clearFilters() {
        this.setState({ globalFilter: getStandardGlobalFilter() });
    }

    toggleFiltersOpen() {
        this.setState({ filtersOpen: !this.state.filtersOpen });
    }

    fillDatesStandard() {
        this.setState({
            globalFilter: {
                ...this.state.globalFilter,
                startDate: this.props.dateRange.startDate,
                endDate: this.props.dateRange.endDate,
            },
        });
    }

    handleInputChange(event) {
        const { target } = event;
        const { name } = target;
        let { value } = target;

        if (target.type === 'select-multiple') {
            value = [...event.target.options].filter(o => o.selected).map(o => o.value);
        } else if (target.type === 'range') {
            value = target.valueAsNumber;
        }

        this.setState(prevState => ({
            globalFilter: {
                ...prevState.globalFilter,
                [name]: value,
            },
        }));
    }

    handleEmailClassesInputChange(event) {
        const { name } = event.target;

        const { selectedEmailClasses } = this.state.globalFilter;
        const classIndex = selectedEmailClasses.indexOf(name);
        if (classIndex !== -1) {
            selectedEmailClasses.splice(classIndex, 1);
        } else {
            selectedEmailClasses.push(name);
        }
        this.setState(prevState => ({
            globalFilter: {
                ...prevState.globalFilter,
                selectedEmailClasses,
            },
        }));
    }

    render() {
        const emailClassesOptions = this.props.emailClasses.map(emailClass => (
            <FormGroup check inline key={emailClass} className="mr-3">
                <Label check>
                    <Input
                        name={emailClass}
                        type="checkbox"
                        checked={this.state.globalFilter.selectedEmailClasses.includes(emailClass)}
                        onChange={this.handleEmailClassesInputChange}
                    /> {emailClass}
                    <span className="custom-checkbox" />
                </Label>
            </FormGroup>
        ));

        const topicsOptions = this.props.topics.map(topic => (
            <option key={topic.topic_id} value={topic.topic_id}>
                {topic.label}
            </option>
        ));

        return (
            <React.Fragment>
                <InputGroup>
                    <Input
                        type="text"
                        name="searchTerm"
                        placeholder="Search term"
                        value={this.state.globalFilter.searchTerm}
                        onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                        onChange={this.handleInputChange}
                    />
                    <Button color="primary" onClick={this.commitSearch} className="mr-3">
                        <FontAwesome name="search" className="mr-2" />
                        Search
                    </Button>
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
                            <Label sm={2} className="text-right font-weight-bold">Date</Label>
                            <Col sm={10} className="date-inputs">
                                <Label className="col-form-label mr-3" for="start-date">From</Label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    id="start-date"
                                    value={this.state.globalFilter.startDate}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleInputChange}
                                    className="mr-3"
                                />
                                <Label className="col-form-label mr-3" for="endDate">To</Label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    id="end-date"
                                    value={this.state.globalFilter.endDate}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleInputChange}
                                    className="mr-3"
                                />
                                <Button
                                    color="primary"
                                    onClick={this.fillDatesStandard}
                                >
                                    <FontAwesome name="calendar" className="mr-2" />
                                    Maximum
                                </Button>
                            </Col>
                        </FormGroup>
                        {!this.props.pathname.startsWith('/correspondent/') &&
                            <FormGroup row>
                                <Label sm={2} className="text-right font-weight-bold">Correspondents</Label>
                                <Col sm={10} className="correspondent-inputs">
                                    <Label className="col-form-label mr-3" for="sender">From</Label>
                                    <Input
                                        type="text"
                                        name="sender"
                                        id="sender"
                                        placeholder="Sender"
                                        value={this.state.globalFilter.sender}
                                        onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                        onChange={this.handleInputChange}
                                        className="mr-3"
                                    />
                                    <Label className="col-form-label mr-3" for="recipient">To</Label>
                                    <Input
                                        type="text"
                                        name="recipient"
                                        id="recipient"
                                        placeholder="Recipient"
                                        value={this.state.globalFilter.recipient}
                                        onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </FormGroup>
                        }
                        <FormGroup row>
                            <Label for="topics" sm={2} className="text-right font-weight-bold">
                                Topics
                            </Label>
                            <Col sm={7}>
                                <Input
                                    type="select"
                                    name="selectedTopics"
                                    id="topics"
                                    multiple
                                    value={this.state.globalFilter.selectedTopics}
                                    onChange={this.handleInputChange}
                                >
                                    {topicsOptions}
                                </Input>
                            </Col>
                            <Col sm={3}>
                                <Label for="topic-threshold">
                                    Topic threshold
                                </Label>
                                <p className="font-weight-bold pull-right">
                                    {`${(this.state.globalFilter.topicThreshold * 100).toFixed()}%`}
                                </p>
                                <Input
                                    type="range"
                                    name="topicThreshold"
                                    id="topic-threshold"
                                    min="0.01"
                                    max="1"
                                    step="0.01"
                                    value={this.state.globalFilter.topicThreshold}
                                    onChange={this.handleInputChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2} className="text-right font-weight-bold">Classes</Label>
                            <Col sm={6} className="mt-2 email-classes">
                                {emailClassesOptions}
                            </Col>
                            <Col sm={4} className="text-right">
                                <Button
                                    color="danger"
                                    onClick={this.clearFilters}
                                    disabled={_.isEqual(this.state.globalFilter, getStandardGlobalFilter())}
                                    className="mr-3"
                                >
                                    <FontAwesome name="times" className="mr-2" />
                                    Clear
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={this.commitFilters}
                                >
                                    <FontAwesome name="filter" className="mr-2" />
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
    globalFilter: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        topicThreshold: PropTypes.number.isRequired,
        selectedEmailClasses: PropTypes.array.isRequired,
    }).isRequired,
    emailClasses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    topics: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    dateRange: PropTypes.shape({
        startDate: PropTypes.string,
        endDate: PropTypes.string,
    }).isRequired,
    handleGlobalFilterChange: PropTypes.func.isRequired,
    updateBrowserSearchPath: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
};

export default SearchBar;
