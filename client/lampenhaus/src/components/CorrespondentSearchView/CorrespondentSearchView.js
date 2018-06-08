import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Col,
    Container,
    Row,
} from 'reactstrap';
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
    requestCorrespondentList
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
            resultsPerPage: 10,
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
            console.log('should start fetching');
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
        console.log('!!!!', this.props.correspondentList.results);
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

CorrespondentSearchView.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondentSearchView);
