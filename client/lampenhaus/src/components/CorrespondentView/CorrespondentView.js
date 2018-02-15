import React, { Component } from 'react';
import {
    Col,
    Container,
    Row,
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CorrespondentList from './CorrespondentList/CorrespondentList';
import TermList from './TermList/TermList';
import GraphView from '../GraphView/GraphView';
import TopicList from './TopicList/TopicList';
import './CorrespondentView.css';
import * as actions from '../../actions/actions';

const mapStateToProps = state => ({
    emailAddress: state.correspondent.emailAddress,
    terms: state.correspondent.terms,
    topics: state.correspondent.topics,
    isFetchingTerms: state.correspondent.isFetchingTerms,
    correspondents: state.correspondent.correspondents,
    isFetchingCorrespondents: state.correspondent.isFetchingCorrespondents,
    isFetchingTopics: state.correspondent.isFetchingTopics,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onCorrespondentEmailAddressUpdated: actions.setCorrespondentEmailAddress,
    getTerms: actions.requestTerms,
    getTopics: actions.requestTopics,
    getCorrespondents: actions.requestCorrespondents,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class CorrespondentView extends Component {
    constructor(props) {
        super(props);
        const { emailAddress } = props.match.params;
        // FYI: CorrespondentView object has prop match.params because
        // its parent is assumed to be a <Route> of react-router-dom
        props.onCorrespondentEmailAddressUpdated(emailAddress);
        props.getTerms(emailAddress);
        props.getCorrespondents(emailAddress);
        props.getTopics(emailAddress);
    }

    componentDidUpdate(prevProps) {
        if (this.didCorrespondentEmailChange(prevProps)) {
            const { emailAddress } = this.props.match.params;
            this.props.onCorrespondentEmailAddressUpdated(emailAddress);
            this.props.getTerms(emailAddress);
            this.props.getTopics(emailAddress);
            this.props.getCorrespondents(emailAddress);
        }
    }

    didCorrespondentEmailChange(prevProps) {
        return prevProps.match.params.emailAddress !== this.props.match.params.emailAddress;
    }

    render() {
        return (
            <Container fluid className="App">
                <Row id="correspondentHeadline">
                    <Col sm="12">
                        <h2>{this.props.emailAddress}</h2>
                    </Col>
                </Row>
                <Row className="correspondent-lists">
                    <Col sm="6">
                        <Card>
                            <CardHeader tag="h4">Correspondents</CardHeader>
                            <CardBody>
                                <CorrespondentList
                                    emailAddress={this.props.emailAddress}
                                    correspondents={this.props.correspondents}
                                    isFetching={this.props.isFetchingCorrespondents}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card>
                            <CardHeader tag="h4">Terms</CardHeader>
                            <CardBody>
                                <TermList
                                    emailAddress={this.props.emailAddress}
                                    terms={this.props.terms}
                                    isFetching={this.props.isFetchingTerms}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <GraphView
                                    emailAddress={this.props.emailAddress}
                                    updateBrowserCorrespondentPath={this.props.updateBrowserCorrespondentPath}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6">
                        <h4> Topics </h4>
                        <TopicList
                            emailAddress={this.props.emailAddress}
                            topics={this.props.topics}
                            isFetching={this.props.isFetchingTopics}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

CorrespondentView.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            emailAddress: PropTypes.string,
        }),
    }).isRequired,
    topics: PropTypes.arrayOf(PropTypes.shape({
        confidence: PropTypes.number.isRequired,
        words: PropTypes.arrayOf(PropTypes.shape({
            word: PropTypes.string.isRequired,
            confidence: PropTypes.number.isRequired,
        })).isRequired,
    })).isRequired,
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })).isRequired,
    terms: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    emailAddress: PropTypes.string.isRequired,
    onCorrespondentEmailAddressUpdated: PropTypes.func.isRequired,
    updateBrowserCorrespondentPath: PropTypes.func.isRequired,
    getTerms: PropTypes.func.isRequired,
    getTopics: PropTypes.func.isRequired,
    isFetchingTerms: PropTypes.bool.isRequired,
    isFetchingTopics: PropTypes.bool.isRequired,
    getCorrespondents: PropTypes.func.isRequired,
    isFetchingCorrespondents: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondentView);
