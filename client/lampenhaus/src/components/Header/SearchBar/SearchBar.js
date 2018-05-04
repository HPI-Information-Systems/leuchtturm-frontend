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

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtersOpen: false,
            globalFilters: {
                searchTerm: '',
                startDate: '',
                endDate: '',
                sender: '',
                recipient: '',
                selectedTopics: [],
                selectedEmailClasses: new Set(),
            },
        };
        this.emptyFilters = _.cloneDeep(this.state.globalFilters);
        this.commitSearch = this.commitSearch.bind(this);
        this.commitFilters = this.commitFilters.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.toggleFiltersOpen = this.toggleFiltersOpen.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEmailClassesInputChange = this.handleEmailClassesInputChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.state.globalFilters, nextProps.globalFilters)) {
            this.setState({ globalFilters: nextProps.globalFilters });
        }
    }

    commitSearch() {
        this.commitFilters();
        this.props.updateBrowserSearchPath(this.state.globalFilters.searchTerm);
    }

    commitFilters() {
        this.props.handleGlobalFiltersChange(this.state.globalFilters);
    }

    clearFilters() {
        this.setState({ globalFilters: _.cloneDeep(this.emptyFilters) });
    }

    toggleFiltersOpen() {
        this.setState({ filtersOpen: !this.state.filtersOpen });
    }

    handleInputChange(event) {
        const { target } = event;
        const { name } = target;
        let { value } = target;

        if (target.type === 'select-multiple') {
            value = [...event.target.options].filter(o => o.selected).map(o => o.value);
        }

        this.setState(prevState => ({
            globalFilters: {
                ...prevState.globalFilters,
                [name]: value,
            },
        }));
    }

    handleEmailClassesInputChange(event) {
        const { name } = event.target;

        const { selectedEmailClasses } = this.state.globalFilters;
        if (selectedEmailClasses.has(name)) {
            selectedEmailClasses.delete(name);
        } else {
            selectedEmailClasses.add(name);
        }
        this.setState(prevState => ({
            globalFilters: {
                ...prevState.globalFilters,
                selectedEmailClasses,
            },
        }));
    }

    render() {
        const emailClassesOptions = this.props.emailClasses.map(emailClass => (
            <FormGroup check inline key={emailClass}>
                <Label check>
                    <Input
                        name={emailClass}
                        type="checkbox"
                        checked={this.state.globalFilters.selectedEmailClasses.has(emailClass) || false}
                        onChange={this.handleEmailClassesInputChange}
                    /> {emailClass}
                </Label>
            </FormGroup>
        ));

        const topicsOptions = this.props.topics.map(topic => (
            <option key={topic.id} value={topic.id}>{topic.name}</option>
        ));

        return (
            <React.Fragment>
                <InputGroup>
                    <Input
                        type="text"
                        name="searchTerm"
                        placeholder="Search term"
                        value={this.state.globalFilters.searchTerm}
                        onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                        onChange={this.handleInputChange}
                    />
                    <Button color="primary" onClick={this.commitSearch} className="mr-2">
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
                            <Label sm={2} className="text-right">Date</Label>
                            <Label sm={1} for="startDate">From</Label>
                            <Col sm={4}>
                                <Input
                                    type="date"
                                    name="startDate"
                                    id="startDate"
                                    value={this.state.globalFilters.startDate}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleInputChange}
                                />
                            </Col>
                            <Label sm={1} for="endDate">To</Label>
                            <Col sm={4}>
                                <Input
                                    type="date"
                                    name="endDate"
                                    id="endDate"
                                    value={this.state.globalFilters.endDate}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleInputChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2} className="text-right">Correspondents</Label>
                            <Label sm={1} for="sender">From</Label>
                            <Col sm={4}>
                                <Input
                                    type="text"
                                    name="sender"
                                    id="sender"
                                    placeholder="Sender"
                                    value={this.state.globalFilters.sender}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleInputChange}
                                />
                            </Col>
                            <Label sm={1} for="recipient">To</Label>
                            <Col sm={4}>
                                <Input
                                    type="text"
                                    name="recipient"
                                    id="recipient"
                                    placeholder="Recipient"
                                    value={this.state.globalFilters.recipient}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleInputChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="topics" sm={2} className="text-right">Topics</Label>
                            <Col sm={10}>
                                <Input
                                    type="select"
                                    name="selectedTopics"
                                    id="topics"
                                    multiple
                                    value={this.state.globalFilters.selectedTopics}
                                    onChange={this.handleInputChange}
                                >
                                    {topicsOptions}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2} className="text-right">Classes</Label>
                            <Col sm={7} className="mt-2">
                                {emailClassesOptions}
                            </Col>
                            <Col sm={3}>
                                <Button
                                    color="danger"
                                    onClick={this.clearFilters}
                                    disabled={_.isEqual(this.state.globalFilters, this.emptyFilters)}
                                >
                                    <FontAwesome name="times" className="mr-2" />
                                    Clear
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={this.commitFilters}
                                    className="pull-right"
                                    disabled={_.isEqual(this.state.globalFilters, this.emptyFilters)}
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
    globalFilters: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        selectedEmailClasses: PropTypes.object.isRequired,
    }).isRequired,
    emailClasses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    topics: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    handleGlobalFiltersChange: PropTypes.func.isRequired,
    updateBrowserSearchPath: PropTypes.func.isRequired,
};

export default SearchBar;