import { Col, Container, Row } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { requestDatasets, setSelectedDataset } from '../../actions/datasetActions';
import {
    handleGlobalFilterChange,
    requestTopicsForFilters,
    requestDateRangeForFilters,
} from '../../actions/globalFilterActions';
import SearchBar from './SearchBar/SearchBar';
import DatasetSelector from './DatasetSelector/DatasetSelector';
import getStandardGlobalFilter from '../../utils/getStandardGlobalFilter';
import lighthouse from '../../assets/lighthouse.svg';
import './Header.css';

const mapStateToProps = state => ({
    datasets: state.datasets,
    globalFilter: state.globalFilter.filters,
    dateRange: state.globalFilter.dateRange,
    topics: state.globalFilter.topics,
    emailClasses: state.globalFilter.emailClasses,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedDataset,
    requestDatasets,
    handleGlobalFilterChange,
    requestTopicsForFilters,
    requestDateRangeForFilters,
}, dispatch);

class Header extends Component {
    constructor(props) {
        super(props);
        this.getDataForGlobalFilter = this.getDataForGlobalFilter.bind(this);
        this.updateBrowserSearchPath = this.updateBrowserSearchPath.bind(this);
        this.goToOverview = this.goToOverview.bind(this);
    }

    componentDidMount() {
        this.getDataForGlobalFilter();
    }

    getDataForGlobalFilter() {
        this.props.requestTopicsForFilters();
        this.props.requestDateRangeForFilters();
    }

    updateBrowserSearchPath(searchTerm) {
        this.props.history.push(`/search/${searchTerm}`);
    }

    goToOverview() {
        this.props.handleGlobalFilterChange(getStandardGlobalFilter());
    }

    render() {
        return (
            <header className="lampenhaus-header">
                <Container fluid>
                    <Row>
                        <Col sm="auto">
                            <Link to="/search/" onClick={this.goToOverview} className="lampenhaus-title">
                                <img src={lighthouse} alt="lighthouse" className="ml-2" />
                            </Link>
                        </Col>
                        <Col>
                            <SearchBar
                                globalFilter={this.props.globalFilter}
                                handleGlobalFilterChange={
                                    globalFilter => this.props.handleGlobalFilterChange(globalFilter)}
                                updateBrowserSearchPath={this.updateBrowserSearchPath}
                                pathname={this.props.location.pathname}
                                emailClasses={this.props.emailClasses}
                                topics={this.props.topics}
                                dateRange={this.props.dateRange}
                            />
                        </Col>
                        <Col sm="auto">
                            <DatasetSelector
                                setSelectedDataset={this.props.setSelectedDataset}
                                requestDatasets={this.props.requestDatasets}
                                datasets={this.props.datasets}
                                getDataForGlobalFilter={this.getDataForGlobalFilter}
                            />
                        </Col>
                    </Row>
                </Container>
            </header>
        );
    }
}

Header.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    datasets: PropTypes.shape({
        selectedDataset: PropTypes.string.isRequired,
        isFetchingDatasets: PropTypes.bool.isRequired,
        hasDatasetsData: PropTypes.bool.isRequired,
        datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    setSelectedDataset: PropTypes.func.isRequired,
    requestDatasets: PropTypes.func.isRequired,
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
    handleGlobalFilterChange: PropTypes.func.isRequired,
    requestTopicsForFilters: PropTypes.func.isRequired,
    requestDateRangeForFilters: PropTypes.func.isRequired,
    topics: PropTypes.arrayOf(PropTypes.object).isRequired,
    dateRange: PropTypes.shape({
        start: PropTypes.string,
        end: PropTypes.string,
    }).isRequired,
    emailClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
