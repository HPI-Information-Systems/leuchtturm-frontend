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
            checkboxes: [],
            globalFilters: {
                searchTerm: '',
                startDate: '',
                endDate: '',
                selectedTopics: [],
                selectedClasses: [],
            },
        };
        this.commitSearch = this.commitSearch.bind(this);
        this.toggleFiltersOpen = this.toggleFiltersOpen.bind(this);
        this.handleGlobalFiltersChange = this.handleGlobalFiltersChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const checkboxes = {};
        this.props.emailClasses.forEach((emailClass) => { checkboxes[emailClass] = false; });

        this.setState({ checkboxes });

        if (this.relevantPropsChanged(nextProps)) {
            this.state.globalFilters.searchTerm = nextProps.globalFilters.searchTerm;
            this.state.globalFilters.startDate = nextProps.globalFilters.startDate;
            this.state.globalFilters.endDate = nextProps.globalFilters.endDate;
        }
    }

    relevantPropsChanged(nextProps) {
        return (
            this.props.globalFilters.searchTerm !== nextProps.globalFilters.searchTerm ||
            this.props.globalFilters.startDate !== nextProps.globalFilters.startDate ||
            this.props.globalFilters.endDate !== nextProps.globalFilters.endDate
        );
    }

    commitSearch() {
        this.props.handleGlobalFiltersChange(this.state.globalFilters);
    }

    toggleFiltersOpen() {
        this.setState({ filtersOpen: !this.state.filtersOpen });
    }

    handleGlobalFiltersChange(event) {
        const { target } = event;
        const { name } = target;

        let { value } = target;
        if (target.type === 'select-multiple') {
            value = [...event.target.options].filter(o => o.selected).map(o => o.value);
        } else if (target.type === 'checkbox') {
            this.setState(prevState => ({
                checkboxes: {
                    ...prevState.checkboxes,
                    [name]: target.checked,
                },
            }));
            console.log(this.state);
        }

        this.setState(prevState => ({
            globalFilters: {
                ...prevState.globalFilters,
                [name]: value,
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
                        checked={this.state.checkboxes[emailClass] || false}
                        onChange={this.handleGlobalFiltersChange}
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
                        placeholder="Enter search term"
                        value={this.state.globalFilters.searchTerm}
                        onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                        onChange={this.handleGlobalFiltersChange}
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
                                    value={this.state.globalFilters.startDate}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleGlobalFiltersChange}
                                />
                            </Col>
                            <Label sm={1} for="to">To</Label>
                            <Col sm={4}>
                                <Input
                                    type="date"
                                    name="endDate"
                                    id="to"
                                    value={this.state.globalFilters.endDate}
                                    onKeyPress={e => e.key === 'Enter' && this.commitSearch()}
                                    onChange={this.handleGlobalFiltersChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="topics" sm={2}>Topics</Label>
                            <Col sm={10}>
                                <Input
                                    type="select"
                                    name="selectedTopics"
                                    id="topics"
                                    multiple
                                    value={this.state.globalFilters.selectedTopics}
                                    onChange={this.handleGlobalFiltersChange}
                                >
                                    {topicsOptions}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2}>Classes</Label>
                            <Col sm={10}>
                                {emailClassesOptions}
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
    }).isRequired,
    emailClasses: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    topics: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    handleGlobalFiltersChange: PropTypes.func.isRequired,
};

export default SearchBar;
