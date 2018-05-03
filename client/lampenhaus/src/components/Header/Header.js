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
    datasets: state.datasets,
    globalFilters: state.globalFilters,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSelectedDataset: actions.setSelectedDataset,
    requestDatasets: actions.requestDatasets,
    handleGlobalFiltersChange: actions.handleGlobalFiltersChange,
}, dispatch);

class Header extends Component {
    constructor(props) {
        super(props);
        this.updateBrowserSearchPath = this.updateBrowserSearchPath.bind(this);
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
                                emailClasses={['Business', 'Private', 'Spam']}
                                topics={[{
                                    id: 1,
                                    name: 'Management',
                                }, {
                                    id: 2,
                                    name: 'Raptor',
                                }, {
                                    id: 3,
                                    name: 'Finance',
                                }, {
                                    id: 4,
                                    name: 'Energy',
                                }, {
                                    id: 5,
                                    name: 'California',
                                },
                                ]}
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
    globalFilters: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        selectedEmailClasses: PropTypes.object.isRequired,
    }).isRequired,
    handleGlobalFiltersChange: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
