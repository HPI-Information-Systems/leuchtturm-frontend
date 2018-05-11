import { Col, Container, Row } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { requestDatasets, setSelectedDataset } from '../../actions/datasetActions';
import { handleGlobalFiltersChange, requestTopicsForFilters } from '../../actions/globalFiltersActions';
import SearchBar from './SearchBar/SearchBar';
import DatasetSelector from './DatasetSelector/DatasetSelector';
import cobaLogo from '../../assets/Commerzbank.svg';

const mapStateToProps = state => ({
    datasets: state.datasets,
    globalFilters: state.globalFilters.filters,
    topics: state.globalFilters.topics,
    emailClasses: state.globalFilters.emailClasses,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedDataset,
    requestDatasets,
    handleGlobalFiltersChange,
    requestTopicsForFilters,
}, dispatch);

class Header extends Component {
    constructor(props) {
        super(props);
        this.updateBrowserSearchPath = this.updateBrowserSearchPath.bind(this);
    }

    componentDidMount() {
        this.props.requestTopicsForFilters();
    }

    updateBrowserSearchPath(searchTerm) {
        this.props.history.push(`/search/${searchTerm}`);
    }

    render() {
        return (
            <header className="lampenhaus-header">
                <Container fluid>
                    <Row>
                        <Col sm="2">
                            <h1 className="lampenhaus-title">
                                <FontAwesome name="lightbulb-o" className="ml-2" /> Lampenhaus
                            </h1>
                        </Col>
                        <Col sm="7">
                            <SearchBar
                                globalFilters={this.props.globalFilters}
                                handleGlobalFiltersChange={
                                    globalFilters => this.props.handleGlobalFiltersChange(globalFilters)}
                                updateBrowserSearchPath={this.updateBrowserSearchPath}
                                pathname={this.props.location.pathname}
                                emailClasses={this.props.emailClasses}
                                topics={this.props.topics}
                            />
                        </Col>
                        <Col sm="1">
                            <DatasetSelector
                                setSelectedDataset={this.props.setSelectedDataset}
                                requestDatasets={this.props.requestDatasets}
                                datasets={this.props.datasets}
                            />
                        </Col>
                        <Col sm="2" className="text-right coba-logo">
                            <img src={cobaLogo} alt="logo commerzbank" />
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
    globalFilters: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        topicThreshold: PropTypes.number.isRequired,
        selectedEmailClasses: PropTypes.array.isRequired,
    }).isRequired,
    handleGlobalFiltersChange: PropTypes.func.isRequired,
    requestTopicsForFilters: PropTypes.func.isRequired,
    topics: PropTypes.arrayOf(PropTypes.object).isRequired,
    emailClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
