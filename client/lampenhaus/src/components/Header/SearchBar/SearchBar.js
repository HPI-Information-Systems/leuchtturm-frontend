import React, { Component, Fragment } from 'react';
import {
    Row,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    InputGroup,
    Input,
    Button,
    Collapse,
    Form,
    FormGroup,
    Label,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import _ from 'lodash';
import getStandardGlobalFilter from '../../../utils/getStandardGlobalFilter';
import './SearchBar.css';

const SEARCH_MODE_EMAILS = 'Emails';
const SEARCH_MODE_CORRESPONDENTS = 'Correspondents';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchModeDropdownOpen: false,
            searchMode: this.props.pathname.startsWith('/correspondent_search/')
                ? SEARCH_MODE_CORRESPONDENTS : SEARCH_MODE_EMAILS,
            filtersOpen: false,
            globalFilter: getStandardGlobalFilter(),
            activeTab: 'dates',
        };
        this.triggerSearch = this.triggerSearch.bind(this);
        this.commitCorrespondentSearch = this.commitCorrespondentSearch.bind(this);
        this.commitEmailSearch = this.commitEmailSearch.bind(this);
        this.commitFilters = this.commitFilters.bind(this);
        this.clearFilters = this.clearFilters.bind(this);
        this.toggleFiltersOpen = this.toggleFiltersOpen.bind(this);
        this.toggleSearchModeDropdownOpen = this.toggleSearchModeDropdownOpen.bind(this);
        this.fillDatesStandard = this.fillDatesStandard.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleEmailClassesInputChange = this.handleEmailClassesInputChange.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.state.globalFilter, nextProps.globalFilter)) {
            this.setState({ globalFilter: nextProps.globalFilter });
        }
    }

    setSearchMode(mode) {
        this.setState({ searchMode: mode });
    }

    triggerSearch() {
        if (this.state.searchMode === SEARCH_MODE_CORRESPONDENTS) {
            this.commitCorrespondentSearch();
        } else {
            this.commitEmailSearch();
        }
    }

    commitCorrespondentSearch() {
        this.props.updateBrowserCorrespondentSearchPath(this.state.globalFilter.searchTerm);
        this.props.setShouldFetchCorrespondentListData(true);
        this.props.handleGlobalFilterChange(this.state.globalFilter);
    }

    commitEmailSearch() {
        this.props.updateBrowserSearchPath(this.state.globalFilter.searchTerm);
        this.props.setShouldFetchEmailListData(true);
        this.props.handleGlobalFilterChange(this.state.globalFilter);
    }

    commitFilters() {
        if (this.props.pathname.startsWith('/search/')) {
            this.props.updateBrowserSearchPath(this.state.globalFilter.searchTerm);
            this.props.setShouldFetchEmailListData(true);
        }
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

    toggleSearchModeDropdownOpen() {
        this.setState({ searchModeDropdownOpen: !this.state.searchModeDropdownOpen });
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const emailClassesOptions = this.props.emailClasses.map(emailClass => (
            <FormGroup check inline key={emailClass} className="mr-4">
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
            <Fragment>
                <InputGroup className="search-bar">
                    <Input
                        type="text"
                        name="searchTerm"
                        placeholder="Search term"
                        value={this.state.globalFilter.searchTerm}
                        onKeyPress={e => e.key === 'Enter' && this.triggerSearch()}
                        onChange={this.handleInputChange}
                    />
                    <Button color="primary" onClick={this.triggerSearch} className="search-trigger">
                        <FontAwesome name="search" />
                    </Button>
                    <Dropdown isOpen={this.state.searchModeDropdownOpen} toggle={this.toggleSearchModeDropdownOpen}>
                        <DropdownToggle caret color="primary">
                            {this.state.searchMode}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                onClick={() => this.setSearchMode(SEARCH_MODE_CORRESPONDENTS)}
                                active={this.state.searchMode === SEARCH_MODE_CORRESPONDENTS}
                            >
                                {SEARCH_MODE_CORRESPONDENTS}
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => this.setSearchMode(SEARCH_MODE_EMAILS)}
                                active={this.state.searchMode === SEARCH_MODE_EMAILS}
                            >
                                {SEARCH_MODE_EMAILS}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    {(this.props.pathname.startsWith('/search/') || this.props.pathname.startsWith('/correspondent/'))
                    &&
                    <Button color="secondary" onClick={this.toggleFiltersOpen} className="ml-3">
                        <FontAwesome
                            name={!this.state.filtersOpen ? 'caret-right' : 'caret-down'}
                            className="mr-2"
                        />
                        Filters
                    </Button>}
                </InputGroup>
                {(this.props.pathname.startsWith('/search/') || this.props.pathname.startsWith('/correspondent/')) &&
                <Collapse isOpen={this.state.filtersOpen} className="filters">
                    <Form>
                        <Row>
                            <Col sm="9">
                                <Nav tabs>
                                    <NavItem>
                                        <NavLink
                                            className={this.state.activeTab === 'dates' ? 'active' : ''}
                                            onClick={() => { this.toggleTab('dates'); }}
                                        >
                                            Date
                                            {(this.state.globalFilter.startDate !== getStandardGlobalFilter().startDate
                                            || this.state.globalFilter.endDate !== getStandardGlobalFilter().endDate)
                                            && ' •'}
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={this.state.activeTab === 'correspondents' ? 'active' : ''}
                                            onClick={() => { this.toggleTab('correspondents'); }}
                                        >
                                            Correspondents
                                            {(this.state.globalFilter.sender !== getStandardGlobalFilter().sender
                                            || this.state.globalFilter.recipient
                                                !== getStandardGlobalFilter().recipient)
                                            && ' •'}
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={this.state.activeTab === 'topics' ? 'active' : ''}
                                            onClick={() => { this.toggleTab('topics'); }}
                                        >
                                            Topics
                                            {this.state.globalFilter.selectedTopics.length
                                            !== getStandardGlobalFilter().selectedTopics.length
                                            && ' •'}
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={this.state.activeTab === 'email-classes' ? 'active' : ''}
                                            onClick={() => { this.toggleTab('email-classes'); }}
                                        >
                                            Email Classes
                                            {this.state.globalFilter.selectedEmailClasses.length
                                            !== getStandardGlobalFilter().selectedEmailClasses.length
                                            && ' •'}
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={this.state.activeTab} className="px-4 pt-3">
                                    <TabPane tabId="dates">
                                        <FormGroup row>
                                            <Col className="date-inputs">
                                                <Label className="col-form-label mr-3" for="start-date">From</Label>
                                                <Input
                                                    type="date"
                                                    name="startDate"
                                                    id="start-date"
                                                    value={this.state.globalFilter.startDate}
                                                    onKeyPress={e => e.key === 'Enter' && this.commitEmailSearch()}
                                                    onChange={this.handleInputChange}
                                                    className="mr-3"
                                                />
                                                <Label className="col-form-label mr-3" for="endDate">To</Label>
                                                <Input
                                                    type="date"
                                                    name="endDate"
                                                    id="end-date"
                                                    value={this.state.globalFilter.endDate}
                                                    onKeyPress={e => e.key === 'Enter' && this.commitEmailSearch()}
                                                    onChange={this.handleInputChange}
                                                />
                                                {!this.props.hasDateRangeRequestError &&
                                                <Button
                                                    className="ml-3"
                                                    color="primary"
                                                    onClick={this.fillDatesStandard}
                                                >
                                                    <FontAwesome name="calendar" className="mr-2" />
                                                    All Dates
                                                </Button>
                                                }
                                            </Col>
                                        </FormGroup>
                                    </TabPane>
                                    <TabPane tabId="correspondents">
                                        {!this.props.pathname.startsWith('/correspondent/') &&
                                        <FormGroup row>
                                            <Col className="correspondent-inputs">
                                                <Label className="col-form-label mr-3" for="sender">From</Label>
                                                <Input
                                                    type="text"
                                                    name="sender"
                                                    id="sender"
                                                    placeholder="Sender"
                                                    value={this.state.globalFilter.sender}
                                                    onKeyPress={e => e.key === 'Enter' && this.commitEmailSearch()}
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
                                                    onKeyPress={e => e.key === 'Enter' && this.commitEmailSearch()}
                                                    onChange={this.handleInputChange}
                                                />
                                            </Col>
                                        </FormGroup>}
                                    </TabPane>
                                    <TabPane tabId="topics">
                                        <FormGroup row>
                                            {this.props.hasTopicsRequestError ? (
                                                <Col className="text-danger mt-2">
                                                    An error occurred while requesting the Topics.
                                                </Col>
                                            ) : (
                                                <Fragment>
                                                    <Col sm={8}>
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
                                                    <Col sm={4}>
                                                        <Label for="topic-threshold">
                                                            Topic Confidence
                                                        </Label>
                                                        <p className="font-weight-bold pull-right">
                                                            {`> ${(this.state.globalFilter.topicThreshold * 100)
                                                                .toFixed()}%`}
                                                        </p>
                                                        <Input
                                                            type="range"
                                                            name="topicThreshold"
                                                            id="topic-threshold"
                                                            min="0.01"
                                                            max="0.5"
                                                            step="0.01"
                                                            value={this.state.globalFilter.topicThreshold}
                                                            onChange={this.handleInputChange}
                                                        />
                                                    </Col>
                                                </Fragment>)
                                            }
                                        </FormGroup>
                                    </TabPane>
                                    <TabPane tabId="email-classes">
                                        <FormGroup row>
                                            <Col className="email-classes">
                                                {emailClassesOptions}
                                            </Col>
                                        </FormGroup>
                                    </TabPane>
                                </TabContent>
                            </Col>
                            <Col sm="3" className="filter-buttons pb-3">
                                <div>
                                    <Button
                                        color="danger"
                                        onClick={this.clearFilters}
                                        disabled={_.isEqual(this.state.globalFilter, getStandardGlobalFilter())}
                                        className="mr-3"
                                    >
                                        <FontAwesome name="times" className="mr-2" />
                                        Clear All
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={this.commitFilters}
                                    >
                                        <FontAwesome name="filter" className="mr-2" />
                                        Filter
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Collapse>}
            </Fragment>
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
    hasDateRangeRequestError: PropTypes.bool.isRequired,
    hasTopicsRequestError: PropTypes.bool.isRequired,
    handleGlobalFilterChange: PropTypes.func.isRequired,
    updateBrowserSearchPath: PropTypes.func.isRequired,
    updateBrowserCorrespondentSearchPath: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    setShouldFetchCorrespondentListData: PropTypes.func.isRequired,
    setShouldFetchEmailListData: PropTypes.func.isRequired,
};

export default SearchBar;
