import React, { Component } from 'react';
import { Col, Row, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EntityList from '../EntityList/EntityList';
import EmailCard from './EmailCard/EmailCard';
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

        let entityList = <CardText>No Entites found.</CardText>;
        if (this.props.email.entities) {
            entityList = Object.keys(this.props.email.entities).map(entityType => (
                <EntityList
                    key={entityType}
                    entityType={entityType}
                    entities={this.props.email.entities[entityType]}
                />
            ));
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
                        <EmailCard
                            className="email-card"
                            email={this.props.email}
                        />
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
