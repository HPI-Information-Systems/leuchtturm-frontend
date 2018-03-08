
import { Col, Container, Row } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { bindActionCreators } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import * as actions from '../../actions/actions';
import SearchBar from '../SearchBar/SearchBar';
import cobaLogo from '../../assets/Commerzbank.svg';

const mapStateToProps = state => ({
    search: state.termView,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onRequestSearchResultPage: actions.requestSearchResultPage,
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
                        <Col sm="5">
                            <SearchBar
                                updateBrowserSearchPath={this.updateBrowserSearchPath}
                                searchTerm={this.props.search.searchTerm}
                            />
                        </Col>
                        <Col sm="5" className="text-right coba-logo">
                            <img src={cobaLogo} alt="logo commerzbank" />
                        </Col>
                    </Row>
                    <br />
                </Container>
            </header>
        );
    }
}

Header.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    search: PropTypes.shape({
        searchTerm: PropTypes.string,
        resultsPerPage: PropTypes.number,
        hasData: PropTypes.bool,
        numberOfResults: PropTypes.number,
        isFetching: PropTypes.bool,
        results: PropTypes.array,
        activePageNumber: PropTypes.number,
    }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
