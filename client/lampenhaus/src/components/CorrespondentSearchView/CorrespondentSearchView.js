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
        this.props.setShouldFetchData(true);
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
        console.log('!!!!', this.props.correspondentList.results);
        return (
            <Container fluid>
                <Row>
                    <Col sm="12">
                        <p>x Results</p>
                    </Col>
                </Row>
                <CorrespondentSearchList correspondentList={this.props.correspondentList.results} />
            </Container>
        );
    }
}

CorrespondentSearchView.propTypes = {};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondentSearchView);
