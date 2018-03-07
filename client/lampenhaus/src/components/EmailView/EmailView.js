import React, { Component } from 'react';
import { Container, Col, Row, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EntityList from '../EntityList/EntityList';
import EmailCard from './EmailCard/EmailCard';
import * as actions from '../../actions/actions';
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
    onDocIdUpdated: actions.setDocId,
    getEmail: actions.requestEmail,
    setBodyType: actions.setBodyType,
}, dispatch);

class EmailView extends Component {
    constructor(props) {
        super(props);
        const { docId } = props.match.params;
        props.onDocIdUpdated(docId);
        props.getEmail(docId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.hasEmailData && Object.keys(this.props.email).length > 0) {
            document.title = `Email - ${this.props.email.header.subject}`;
        }
        if (this.didDocIdChange(prevProps)) {
            const { docId } = this.props.match.params;
            this.props.onDocIdUpdated(docId);
            this.props.getEmail(docId);
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
            let entityList = <CardText>No Entities found.</CardText>;
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
                                className="email-card"
                                showRawBody={this.props.showRawBody}
                                setBodyType={this.props.setBodyType}
                                {... this.props.email}
                            />
                            <Card className="attachments-card">
                                <CardBody>
                                    <CardTitle>Attachments</CardTitle>
                                    <CardText>{attachmentsText}</CardText>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col sm="5">
                            <Card className="entity-list-card">
                                <CardBody>
                                    <CardTitle>Entities</CardTitle>
                                    {entityList}
                                </CardBody>
                            </Card>
                            <Card className="topics-card">
                                <CardBody>
                                    <CardTitle>Topics</CardTitle>
                                    <TopicList
                                        topics={this.props.email.topics}
                                        isFetching={this.props.isFetchingEmail}
                                    />
                                </CardBody>
                            </Card>
                            <Card className="similar-mails-card">
                                <CardBody>
                                    <CardTitle>Similar Mails</CardTitle>
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
    onDocIdUpdated: PropTypes.func.isRequired,
    getEmail: PropTypes.func.isRequired,
    isFetchingEmail: PropTypes.bool.isRequired,
    hasEmailData: PropTypes.bool.isRequired,
    showRawBody: PropTypes.bool.isRequired,
    setBodyType: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailView);
