import React, { Component, Fragment } from 'react';
import { Button, Col, Card, CardBody, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import ClusterTopWordList from '../ClusterTopWordList/ClusterTopWordList';
import EmailCard from './EmailCard/EmailCard';
import { setDocId, requestEmail, setBodyType, requestSimilarEmails } from '../../actions/emailViewActions';
import './EmailView.css';
import Spinner from '../Spinner/Spinner';
import TopicSpace from '../TopicSpace/TopicSpace';
import ResultListDumb from '../ResultList/ResultListDumb';
import EmailListTimeline from '../EmailListTimeline/EmailListTimeline';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { handleGlobalFilterChange } from '../../actions/globalFilterActions';
import { setShouldFetchData } from '../../actions/emailListViewActions';

const mapStateToProps = state => ({
    docId: state.emailView.docId,
    email: state.emailView.email,
    isFetchingEmail: state.emailView.isFetchingEmail,
    hasEmailData: state.emailView.hasEmailData,
    hasEmailRequestError: state.emailView.hasEmailRequestError,
    showRawBody: state.emailView.showRawBody,
    similarEmails: state.emailView.similarEmails,
    globalFilter: state.globalFilter.filters,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setShouldFetchData,
    setDocId,
    requestEmail,
    setBodyType,
    requestSimilarEmails,
    handleGlobalFilterChange,
}, dispatch);

class EmailView extends Component {
    constructor(props) {
        super(props);
        const { docId } = props.match.params;
        props.setDocId(docId);
        props.requestEmail(docId);
        props.requestSimilarEmails(docId);
        this.filterByCluster = this.filterByCluster.bind(this);
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

    filterByCluster(number) {
        const { globalFilter } = this.props;
        globalFilter.selectedClusters = [number];
        this.props.handleGlobalFilterChange(globalFilter);
        this.props.history.push('/search/');
    }


    didDocIdChange(prevProps) {
        return prevProps.match.params.docId !== this.props.match.params.docId;
    }

    render() {
        if (this.props.isFetchingEmail) {
            return <div className="email-view grid-container"><Spinner /></div>;
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

            let similarEmails = !this.props.similarEmails.data.docs || this.props.similarEmails.data.docs.length === 0
                ? <div>No similar mails found.</div>
                : (
                    <ResultListDumb
                        results={this.props.similarEmails.data.docs}
                        isFetching={this.props.similarEmails.isFetching}
                    />
                );

            similarEmails = this.props.similarEmails.isFetching ? <Spinner /> : similarEmails;

            return (
                <div className="email-view grid-container">
                    <div className="grid-item email-container">
                        <ErrorBoundary displayAsCard title="Email">
                            <EmailCard
                                showRawBody={this.props.showRawBody}
                                setBodyType={this.props.setBodyType}
                                {...this.props.email}
                            />
                        </ErrorBoundary>
                    </div>
                    <div className="grid-item similar-mails-container">
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
                    </div>
                    <div className="grid-item keyphrases-container">
                        <ErrorBoundary displayAsCard title="Top Phrases">
                            <Card>
                                <CardHeader tag="h4">
                                    Top Phrases
                                </CardHeader>
                                <CardBody>
                                    {this.props.email.keyphrases.length > 0 &&
                                        <ListGroup>
                                            {this.props.email.keyphrases.map(phrase => (
                                                <ListGroupItem>
                                                    <Link
                                                        to={`/search/${phrase}`}
                                                        onClick={() => this.searchFor(phrase)}
                                                    >
                                                        {phrase}
                                                    </Link>
                                                </ListGroupItem>))}
                                        </ListGroup>
                                    }
                                </CardBody>
                            </Card>
                        </ErrorBoundary>
                    </div>
                    <div className="grid-item timeline-container">
                        <ErrorBoundary displayAsCard title="Timeline">
                            <EmailListTimeline
                                className="email-timeline"
                                dates={this.props.similarEmails.data.dates}
                                isFetching={this.props.similarEmails.isFetching}
                                hasData={this.props.similarEmails.hasData}
                                hasRequestError={this.props.similarEmails.hasRequestError}
                                setShouldFetchData={this.props.setShouldFetchData}
                                globalFilter={this.props.globalFilter}
                                handleGlobalFilterChange={this.props.handleGlobalFilterChange}
                                static
                                defaultDateGap="day"
                            />
                        </ErrorBoundary>
                    </div>
                    <div className="grid-item topic-spaces-container">
                        <ErrorBoundary displayAsCard title="Topics">
                            <Card className="topics-card">
                                <CardHeader tag="h4">Topics</CardHeader>
                                <CardBody>
                                    <TopicSpace topics={this.props.email.topics} outerSpaceSize={200} />
                                </CardBody>
                            </Card>
                        </ErrorBoundary>
                    </div>
                    <div className="grid-item cluster-container">
                        <ErrorBoundary displayAsCard title="Cluster list">
                            <Card className="cluster-list-card">
                                <CardHeader tag="h4">
                                    Cluster
                                    <Button
                                        color="primary"
                                        className="pull-right card-header-button mr-2"
                                        size="sm"
                                        onClick={() => this.filterByCluster(this.props.email.cluster.number)}
                                    >
                                        <FontAwesome name="filter" className="mr-2" />
                                        Filter Cluster
                                    </Button>
                                </CardHeader>
                                <CardBody>
                                    Cluster Number: {this.props.email.cluster.number}
                                    {clusterWordLists}
                                </CardBody>
                            </Card>
                        </ErrorBoundary>
                    </div>
                </div>
            );
        } else if (this.props.hasEmailRequestError) {
            return (
                <Col>
                    <Card className="text-danger mt-5">
                        <CardHeader tag="h4">An error occurred while requesting the Email.</CardHeader>
                    </Card>
                </Col>
            );
        }
        return (
            <Col>
                <Card className="mt-5">
                    <CardHeader tag="h4">No Email found.</CardHeader>
                </Card>
            </Col>
        );
    }
}

EmailView.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
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
        keyphrases: PropTypes.array,
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            docId: PropTypes.string,
        }),
    }).isRequired,
    globalFilter: PropTypes.shape({
        selectedClusters: PropTypes.array.isRequired,
    }).isRequired,
    handleGlobalFilterChange: PropTypes.func.isRequired,
    setShouldFetchData: PropTypes.func.isRequired,
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
            dates: PropTypes.shape({
                day: PropTypes.arrayOf(PropTypes.shape({
                    date: PropTypes.string.isRequired,
                    business: PropTypes.number.isRequired,
                    personal: PropTypes.number.isRequired,
                    spam: PropTypes.number.isRequired,
                })),
                week: PropTypes.arrayOf(PropTypes.shape({
                    date: PropTypes.string.isRequired,
                    business: PropTypes.number.isRequired,
                    personal: PropTypes.number.isRequired,
                    spam: PropTypes.number.isRequired,
                })),
                month: PropTypes.arrayOf(PropTypes.shape({
                    date: PropTypes.string.isRequired,
                    business: PropTypes.number.isRequired,
                    personal: PropTypes.number.isRequired,
                    spam: PropTypes.number.isRequired,
                })),
            }).isRequired,
        }).isRequired,
    }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailView);
