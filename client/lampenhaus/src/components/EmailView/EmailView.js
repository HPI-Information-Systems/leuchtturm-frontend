import React, { Component } from 'react';
import { Container, Col, Row, Card, CardBody, CardHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EntityList from '../EntityList/EntityList';
import EmailCard from './EmailCard/EmailCard';
import { setDocId, requestEmail, setBodyType } from '../../actions/emailViewActions';
import './EmailView.css';
import Spinner from '../Spinner/Spinner';
import TopicList from '../TopicList/TopicList';
import SimilarEmails from './SimilarEmails/SimilarEmails';

const mapStateToProps = state => ({
    docId: state.emailView.docId,
    email: state.emailView.email,
    isFetchingEmail: state.emailView.isFetchingEmail,
    hasEmailData: state.emailView.hasEmailData,
    showRawBody: state.emailView.showRawBody,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setDocId,
    requestEmail,
    setBodyType,
}, dispatch);

class EmailView extends Component {
    constructor(props) {
        super(props);
        const { docId } = props.match.params;
        props.setDocId(docId);
        props.requestEmail(docId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasEmailData && Object.keys(this.props.email).length > 0) {
            document.title = `Email - ${this.props.email.header.subject}`;
        }
        if (this.didDocIdChange(prevProps)) {
            const { docId } = this.props.match.params;
            this.props.setDocId(docId);
            this.props.requestEmail(docId);
        }
    }

    didDocIdChange(prevProps) {
        return prevProps.match.params.docId !== this.props.match.params.docId;
    }

    render() {
        if (this.props.isFetchingEmail) {
            return <Spinner />;
        }
        if (this.props.hasEmailData && Object.keys(this.props.email).length > 0) {
            let entityList = 'No Entities found.';
            if (this.props.email.entities) {
                entityList = Object.keys(this.props.email.entities).map(entityType => (
                    <EntityList
                        key={entityType}
                        entityType={entityType}
                        entities={this.props.email.entities[entityType]}
                    />
                ));
            }

            let attachmentsText = 'No attachments found.';
            if (this.props.email.body.indexOf('<<') > -1) {
                attachmentsText = 'See email.';
            }

            return (
                <Container fluid className="email-view-container">
                    <Row>
                        <Col sm="7">
                            <EmailCard
                                showRawBody={this.props.showRawBody}
                                setBodyType={this.props.setBodyType}
                                {... this.props.email}
                            />
                            <Card className="entity-list-card">
                                <CardHeader tag="h4">Entities</CardHeader>
                                <CardBody>
                                    {entityList}
                                </CardBody>
                            </Card>
                            <Card className="attachments-card">
                                <CardHeader tag="h4">Attachments</CardHeader>
                                <CardBody>
                                    {attachmentsText}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="5">
                            <Card className="topics-card">
                                <CardHeader tag="h4">Topics</CardHeader>
                                <CardBody>
                                    <TopicList topics={this.props.email.topics} />
                                </CardBody>
                            </Card>
                            <Card className="similar-mails-card">
                                <CardHeader tag="h4">Similar Mails</CardHeader>
                                <CardBody>
                                    <SimilarEmails docId={this.props.docId} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            );
        }

        return <span>No email data found.</span>;
    }
}

EmailView.propTypes = {
    docId: PropTypes.string.isRequired,
    email: PropTypes.shape({
        entities: PropTypes.objectOf(PropTypes.array.isRequired),
        topics: PropTypes.arrayOf(PropTypes.shape({
            confidence: PropTypes.number.isRequired,
            words: PropTypes.arrayOf(PropTypes.shape({
                word: PropTypes.string.isRequired,
                confidence: PropTypes.number.isRequired,
            })).isRequired,
        })),
        body: PropTypes.string,
        header: PropTypes.shape({
            subject: PropTypes.string,
            sender: PropTypes.shape({
                emailAddress: PropTypes.string,
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
    isFetchingEmail: PropTypes.bool.isRequired,
    hasEmailData: PropTypes.bool.isRequired,
    showRawBody: PropTypes.bool.isRequired,
    setBodyType: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailView);
