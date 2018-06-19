import React, { Component, Fragment } from 'react';
import { Container, Col, Row, Card, CardBody, CardHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ClusterTopWordList from '../ClusterTopWordList/ClusterTopWordList';
import EmailCard from './EmailCard/EmailCard';
import { setDocId, requestEmail, setBodyType, requestSimilarEmails } from '../../actions/emailViewActions';
import './EmailView.css';
import Spinner from '../Spinner/Spinner';
import TopicSpace from '../TopicSpace/TopicSpace';
import ResultListDumb from '../ResultList/ResultListDumb';
import EmailListTimeline from '../EmailListTimeline/EmailListTimeline';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const mapStateToProps = state => ({
    docId: state.emailView.docId,
    email: state.emailView.email,
    isFetchingEmail: state.emailView.isFetchingEmail,
    hasEmailData: state.emailView.hasEmailData,
    hasEmailRequestError: state.emailView.hasEmailRequestError,
    showRawBody: state.emailView.showRawBody,
    similarEmails: state.emailView.similarEmails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setDocId,
    requestEmail,
    setBodyType,
    requestSimilarEmails,
}, dispatch);

class EmailView extends Component {
    constructor(props) {
        super(props);
        const { docId } = props.match.params;
        props.setDocId(docId);
        props.requestEmail(docId);
        props.requestSimilarEmails(docId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasEmailData && Object.keys(this.props.email).length > 0) {
            document.title = `Email - ${this.props.email.header.subject}`;
        }
        if (this.didDocIdChange(prevProps)) {
            const { docId } = this.props.match.params;
            this.props.setDocId(docId);
            this.props.requestEmail(docId);
            this.props.requestSimilarEmails(docId);
        }
    }

    didDocIdChange(prevProps) {
        return prevProps.match.params.docId !== this.props.match.params.docId;
    }

    render() {
        if (this.props.isFetchingEmail) {
            return <Spinner />;
        } else if (this.props.hasEmailData && Object.keys(this.props.email).length > 0) {
            let clusterWordLists = 'No Cluster found.';
            if (this.props.email.cluster) {
                clusterWordLists = (
                    <Fragment>
                        <ClusterTopWordList
                            listName="Top Body Words"
                            words={this.props.email.cluster.top_body_words}
                        />
                        <ClusterTopWordList
                            listName="Top Subject Words"
                            words={this.props.email.cluster.top_subject_words}
                        />
                    </Fragment>
                );
            }

            let similarEmails = this.props.similarEmails.data.docs.length === 0
                ? <div>No similar mails found.</div>
                : (
                    <ResultListDumb
                        results={this.props.similarEmails.data.docs}
                        isFetching={this.props.similarEmails.isFetching}
                    />
                );

            similarEmails = this.props.similarEmails.isFetching ? <Spinner /> : similarEmails;

            return (
                <Container fluid className="email-view-container">
                    <Row>
                        <Col sm="7">
                            <ErrorBoundary displayAsCard title="Email">
                                <EmailCard
                                    showRawBody={this.props.showRawBody}
                                    setBodyType={this.props.setBodyType}
                                    {...this.props.email}
                                />
                            </ErrorBoundary>
                            <ErrorBoundary displayAsCard title="Cluster list">
                                <Card className="cluster-list-card">
                                    <CardHeader tag="h4">Cluster</CardHeader>
                                    <CardBody>
                                        <p>Cluster Number: {this.props.email.cluster.number}</p>
                                        {clusterWordLists}
                                    </CardBody>
                                </Card>
                            </ErrorBoundary>
                        </Col>
                        <Col sm="5">
                            <ErrorBoundary displayAsCard title="Similar Emails">
                                <Card className="similar-mails-card">
                                    <CardHeader tag="h4">Similar Emails</CardHeader>
                                    {this.props.similarEmails.hasRequestError ? (
                                        <CardBody>
                                            An error occurred while requesting Similar Emails.
                                        </CardBody>
                                    ) : (
                                        <CardBody>
                                            { similarEmails }
                                        </CardBody>
                                    )}
                                </Card>
                            </ErrorBoundary>
                            <ErrorBoundary displayAsCard title="Topics">
                                <Card className="topics-card">
                                    <CardHeader tag="h4">Topics</CardHeader>
                                    <CardBody>
                                        <TopicSpace topics={this.props.email.topics} outerSpaceSize={250} />
                                    </CardBody>
                                </Card>
                            </ErrorBoundary>
                        </Col>
                        <Col sm="9" >
                            <ErrorBoundary displayAsCard title="Timeline">
                                <EmailListTimeline
                                    className="term-timeline"
                                    dates={this.props.similarEmails.data.dates}
                                    isFetching={this.props.similarEmails.isFetching}
                                    hasData={this.props.similarEmails.hasData}
                                    hasRequestError={this.props.similarEmails.hasRequestError}
                                    static
                                    defaultDateGap="day"
                                />
                            </ErrorBoundary>
                        </Col>
                    </Row>
                </Container>
            );
        } else if (this.props.hasEmailRequestError) {
            return (
                <Col>
                    <Card className="text-danger">
                        <CardHeader tag="h4">An error occurred while requesting the Email.</CardHeader>
                    </Card>
                </Col>
            );
        }
        return (
            <Col>
                <Card>
                    <CardHeader tag="h4">No Email found.</CardHeader>
                </Card>
            </Col>
        );
    }
}

EmailView.propTypes = {
    docId: PropTypes.string.isRequired,
    email: PropTypes.shape({
        cluster: PropTypes.shape({
            number: PropTypes.string.isRequired,
            top_body_words: PropTypes.arrayOf(PropTypes.string).isRequired,
            top_subject_words: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
        topics: PropTypes.shape({
            main: PropTypes.shape({
                topics: PropTypes.arrayOf(PropTypes.shape({
                    confidence: PropTypes.number,
                    words: PropTypes.arrayOf(PropTypes.shape({
                        word: PropTypes.string,
                        confidence: PropTypes.number,
                    })),
                })),
            }),
            singles: PropTypes.arrayOf(PropTypes.shape({
                topics: PropTypes.arrayOf(PropTypes.shape({
                    confidence: PropTypes.number.isRequired,
                    words: PropTypes.arrayOf(PropTypes.shape({
                        word: PropTypes.string.isRequired,
                        confidence: PropTypes.number.isRequired,
                    })).isRequired,
                })).isRequired,
                doc_id: PropTypes.string,
            })),
        }),
        body: PropTypes.string,
        header: PropTypes.shape({
            subject: PropTypes.string,
            sender: PropTypes.shape({
                identifyingName: PropTypes.string,
            }),
        }),
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            docId: PropTypes.string,
        }),
    }).isRequired,
    setDocId: PropTypes.func.isRequired,
    requestEmail: PropTypes.func.isRequired,
    requestSimilarEmails: PropTypes.func.isRequired,
    isFetchingEmail: PropTypes.bool.isRequired,
    hasEmailData: PropTypes.bool.isRequired,
    hasEmailRequestError: PropTypes.bool.isRequired,
    showRawBody: PropTypes.bool.isRequired,
    setBodyType: PropTypes.func.isRequired,
    similarEmails: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.shape({
            docs: PropTypes.arrayOf(PropTypes.shape({
                body: PropTypes.string.isRequired,
                doc_id: PropTypes.string.isRequired,
                header: PropTypes.shape({
                    subject: PropTypes.string.isRequired,
                }).isRequired,
            })).isRequired,
            dates: PropTypes.arrayOf(PropTypes.shape({
                date: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
            })).isRequired,
        }).isRequired,
    }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailView);
