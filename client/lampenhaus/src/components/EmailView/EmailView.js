import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardHeader, CardText, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EntityList from '../EntityList/EntityList';
import * as actions from '../../actions/actions';
import './EmailView.css';
// import ResultList from '../ResultList/ResultList';
import Spinner from '../Spinner/Spinner';

const mapStateToProps = state => ({
    docId: state.emailView.docId,
    email: state.emailView.email,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDocIdUpdated: actions.setDocId,
    getEmail: actions.requestEmail,
}, dispatch);

// eslint-disable-next-line
class EmailView extends Component {
    constructor(props) {
        super(props);
        const { docId } = props.match.params;
        props.onDocIdUpdated(docId);
        props.getEmail(docId);
    }

    componentDidUpdate(prevProps) {
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
        if (Object.keys(this.props.email).length === 0) {
            return <Spinner />;
        }
        const entityList = Object.keys(this.props.email.entities).map(entityType => (
            <EntityList
                key={entityType}
                entityType={entityType}
                entities={this.props.email.entities[entityType]}
            />
        ));

        const allEntityNames = [];
        Object.keys(this.props.email.entities).forEach(entityType => (
            this.props.email.entities[entityType].forEach(entity => (
                allEntityNames.push(entity.entity)
            ))
        ));

        // TODO: remove when data is automatically extended with 'unknown' fields in preprocessing
        let subject = 'unknown subject';
        let senderName = 'unknown name';
        let senderMail = 'unknown email address';
        let receiverName = senderName;
        let receiverMail = senderMail;
        if (this.props.email.header.Subject[0]) {
            [subject] = this.props.email.header.Subject;
        }
        if (this.props.email.header.sender && this.props.email.header.sender.email) {
            [senderMail] = this.props.email.header.sender.email;
        }
        if (this.props.email.header.sender && this.props.email.header.sender.name) {
            senderName = this.props.email.header.sender.name;
        }
        if (this.props.email.header.To) {
            receiverMail = this.props.email.header.To;
        }
        if (this.props.email.header.To) {
            receiverName = this.props.email.header.To;
        }

        const senderHeader = `From: ${senderMail} (${senderName})`;
        const receiverHeader = `To: ${receiverMail} (${receiverName})`;
        let bodyWithEntitiesHighlighted = this.props.email.body[0];

        if (allEntityNames.length) {
            const allEntityNamesRegExp = new RegExp(`(${allEntityNames.join('|')})`, 'gi');
            const parts = this.props.email.body[0].split(allEntityNamesRegExp);
            let key = 0;
            bodyWithEntitiesHighlighted = parts.map((part) => {
                key += 1;
                return (
                    <span key={key}>
                        {allEntityNames.includes(part) ?
                            <Link to={`/search/${part}`} className="text-primary">
                                {part}
                            </Link> :
                            part
                        }
                    </span>
                );
            });
        }

        return (
            <div className="emailViewContainer">
                <Row>
                    <Col sm="3">
                        <Card className="phrases-card">
                            <CardBody>
                                <CardTitle>Phrases</CardTitle>
                                TODO
                            </CardBody>
                        </Card>
                        <Card className="entity-list-card">
                            <CardBody>
                                <CardTitle>Entities</CardTitle>
                                {entityList}
                            </CardBody>
                        </Card>
                        <Card className="related-articles-card">
                            <CardBody>
                                <CardTitle tag="h5">Related Articles</CardTitle>
                                TODO
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card className="email-card">
                            <CardHeader>
                                <h5>{subject}</h5>
                                <h6>{senderHeader}</h6>
                                <h6>{receiverHeader}</h6>
                            </CardHeader>
                            <CardBody>
                                <CardText>{bodyWithEntitiesHighlighted}</CardText>
                            </CardBody>
                        </Card>
                        <Card className="timeline-card">
                            <CardBody>
                                <CardTitle>Timeline</CardTitle>
                                TODO
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="3">
                        <Card className="similar-mails-card">
                            <CardBody>
                                <CardTitle>Similar Mails</CardTitle>
                                TODO
                            </CardBody>
                        </Card>
                        <Card className="attachments-card">
                            <CardBody>
                                <CardTitle>Attachments & Original File</CardTitle>
                                TODO
                            </CardBody>
                        </Card>
                        <Card className="topics-card">
                            <CardBody>
                                <CardTitle>Topics</CardTitle>
                                TODO
                            </CardBody>
                        </Card>
                        <Card className="graph-card">
                            <CardBody>
                                <CardTitle>Graph</CardTitle>
                                TODO
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

EmailView.propTypes = {
    email: PropTypes.shape({
        entities: PropTypes.objectOf(PropTypes.array.isRequired),
        body: PropTypes.arrayOf(PropTypes.string.isRequired),
        header: PropTypes.shape({
            Subject: PropTypes.arrayOf(PropTypes.string.isRequired),
            To: PropTypes.arrayOf(PropTypes.string.isRequired),
            sender: PropTypes.objectOf(PropTypes.string.isRequired),
        }),
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            docId: PropTypes.string,
        }),
    }).isRequired,
    onDocIdUpdated: PropTypes.func.isRequired,
    getEmail: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmailView);
