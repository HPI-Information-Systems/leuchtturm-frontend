
import { Col, Container, Row } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { bindActionCreators } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import * as actions from '../../actions/actions';
import SearchBar from './SearchBar/SearchBar';
import DatasetSelector from './DatasetSelector/DatasetSelector';
import cobaLogo from '../../assets/Commerzbank.svg';

const mapStateToProps = state => ({
    search: state.termView,
    datasets: state.datasets,
    globalFilter: state.globalFilter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedDataset: actions.setSelectedDataset,
    requestDatasets: actions.requestDatasets,
    setStartDate: actions.setStartDate,
    setEndDate: actions.setEndDate,
}, dispatch);

class Header extends Component {
    constructor(props) {
        super(props);

        this.updateBrowserSearchPath = this.updateBrowserSearchPath.bind(this);
    }

    updateBrowserSearchPath(searchTerm) {
        if (searchTerm) {
            this.props.history.push(`/search/${searchTerm}`);
        }
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
                                updateBrowserSearchPath={this.updateBrowserSearchPath}
                                searchTerm={this.props.search.searchTerm}
                                startDate={this.props.globalFilter.startDate}
                                endDate={this.props.globalFilter.endDate}
                                changeStartDateHandler={this.props.setStartDate}
                                changeEndDateHandler={this.props.setEndDate}
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
    datasets: PropTypes.shape({
        selectedDataset: PropTypes.string.isRequired,
        isFetchingDatasets: PropTypes.bool.isRequired,
        hasDatasetsData: PropTypes.bool.isRequired,
        datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    setSelectedDataset: PropTypes.func.isRequired,
    requestDatasets: PropTypes.func.isRequired,
    search: PropTypes.shape({
        searchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasData: PropTypes.bool,
        numberOfResults: PropTypes.number,
        isFetching: PropTypes.bool,
        results: PropTypes.array,
        activePageNumber: PropTypes.number,
    }).isRequired,
    globalFilter: PropTypes.shape({
        startDate: PropTypes.string,
        endDate: PropTypes.string,
    }).isRequired,
    setStartDate: PropTypes.func.isRequired,
    setEndDate: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
