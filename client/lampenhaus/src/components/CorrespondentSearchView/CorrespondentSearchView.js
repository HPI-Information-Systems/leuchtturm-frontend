import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from 'reactstrap';
import PropTypes from 'prop-types';
import './CorrespondentSearchView.css';
import {
    requestCorrespondentList,
    setShouldFetchData,
} from '../../actions/correspondentSearchViewActions';
import { updateSearchTerm } from '../../actions/globalFilterActions';
import CorrespondentSearchList from './CorrespondentSearchList/CorrespondentSearchList';
import Spinner from '../Spinner/Spinner';


const mapStateToProps = state => ({
    shouldFetchData: state.correspondentSearchView.shouldFetchData,
    correspondentList: state.correspondentSearchView.correspondentList,
    globalFilter: state.globalFilter.filters,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateSearchTerm,
    setShouldFetchData,
    requestCorrespondentList,
}, dispatch);

function setCorrespondentSearchPageTitle(searchTerm) {
    if (!searchTerm) {
        document.title = 'Lampenhaus';
    } else {
        document.title = `Correspondent Search - ${searchTerm}`;
    }
}

class CorrespondentSearchView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resultsPerPage: 8,
            activePageNumber: 1,
        };
        this.onPageNumberChange = this.onPageNumberChange.bind(this);
    }

    componentDidMount() {
        let { searchTerm } = this.props.match.params;
        if (!searchTerm) {
            searchTerm = '';
        }
        this.props.updateSearchTerm(searchTerm);
        this.props.setShouldFetchData(true);
    }

    componentWillReceiveProps(nextProps) {
        const { searchTerm } = nextProps.globalFilter;
        setCorrespondentSearchPageTitle(searchTerm);
        if (nextProps.shouldFetchData) {
            this.requestAllData(nextProps);
        }
    }

    onPageNumberChange(pageNumber) {
        this.requestCorrespondentDataForPage(this.props, pageNumber);
    }

    requestAllData(props) {
        this.props.setShouldFetchData(false);
        this.requestCorrespondentDataForPage(props, 1);
    }

    requestCorrespondentDataForPage(props, pageNumber) {
        this.setState({ activePageNumber: pageNumber });
        this.props.requestCorrespondentList(
            props.globalFilter,
            this.state.resultsPerPage,
            pageNumber,
        );
    }

    render() {
        return (
            <Container fluid>
                {this.props.correspondentList.isFetching && <Spinner />}
                {!this.props.correspondentList.isFetching && this.props.correspondentList.number > 0 &&
                <CorrespondentSearchList
                    correspondentList={this.props.correspondentList.results}
                    numberOfResults={this.props.correspondentList.number}
                    resultsPerPage={this.state.resultsPerPage}
                    maxPageNumber={Math.ceil(this.props.correspondentList.number / this.state.resultsPerPage)}
                    onPageNumberChange={this.onPageNumberChange}
                    activePageNumber={this.state.activePageNumber}
                />
                }
                {!this.props.correspondentList.isFetching && this.props.correspondentList.number === 0 &&
                'No Correspondents found.'}
            </Container>
        );
    }
}

CorrespondentSearchView.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    setShouldFetchData: PropTypes.func.isRequired,
    updateSearchTerm: PropTypes.func.isRequired,
    shouldFetchData: PropTypes.bool.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            searchTerm: PropTypes.string,
        }),
    }).isRequired,
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
    requestCorrespondentList: PropTypes.func.isRequired,
    correspondentList: PropTypes.shape({
        results: PropTypes.arrayOf(PropTypes.shape({
            identifying_name: PropTypes.string,
            hierarchy: PropTypes.number,
            email_addresses: PropTypes.arrayOf(PropTypes.string),
            aliases: PropTypes.arrayOf(PropTypes.string),
        })).isRequired,
        isFetching: PropTypes.bool.isRequired,
        number: PropTypes.number.isRequired,
    }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondentSearchView);
