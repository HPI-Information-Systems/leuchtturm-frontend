import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './CorrespondentSearchView.css';
import {
    requestCorrespondentList,
    setShouldFetchData,
} from '../../actions/correspondentSearchViewActions';
import { updateSearchTerm } from '../../actions/globalFilterActions';

const mapStateToProps = state => ({
    shouldFetchData: state.emailListView.shouldFetchData,
    correspondentList: state.correspondentSearchView.correspondentList,
    globalFilter: state.globalFilter.filters,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateSearchTerm,
    setShouldFetchData,
    requestCorrespondentList
}, dispatch);


class CorrespondentSearchView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resultsPerPage: 50,
            activePageNumber: 1,
        };
    }

    componentDidMount() {
        let { searchTerm } = this.props.match.params;
        if (!searchTerm) {
            searchTerm = '';
        }
        this.props.updateSearchTerm(searchTerm);
    }

    componentWillReceiveProps(nextProps) {
        const { searchTerm } = nextProps.globalFilter;
        // setSearchPageTitle(searchTerm);
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
        console.log('results in render function', this.props.correspondentList.results);
        return (<p>This is an empty view</p>);
    }
}

CorrespondentSearchView.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondentSearchView);
