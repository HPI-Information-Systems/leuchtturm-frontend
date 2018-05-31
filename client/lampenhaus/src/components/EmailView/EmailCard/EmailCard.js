import React, { Component } from 'react';
import { Button, ButtonGroup, Card, CardHeader, CardBody, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './EmailCard.css';
import readableDate from '../../../utils/readableDate';

// eslint-disable-next-line react/prefer-stateless-function
class EmailCard extends Component {
    render() {
        function escapeRegExp(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        }

        let allEntityNames = [];
        if (this.props.entities) {
            Object.keys(this.props.entities).forEach((entityType) => {
                allEntityNames = allEntityNames.concat(this.props.entities[entityType]);
            });
        }

        allEntityNames = allEntityNames.map(entityName => escapeRegExp(entityName));

        let bodyWithEntitiesHighlighted = this.props.body;
        if (allEntityNames.length) {
            const allEntityNamesRegExp = new RegExp(`(${allEntityNames.join('|')})`, 'gi');
            const parts = this.props.body.split(allEntityNamesRegExp);
            bodyWithEntitiesHighlighted = parts.map((part, index) => (
                // eslint-disable-next-line
                <span key={index}>
                    {allEntityNames.includes(part) ?
                        <Link to={`/search/${part}`} className="text-primary">
                            {part}
                        </Link> :
                        part
                    }
                </span>
            ));
        }

        let documentBody = (
            <pre>{bodyWithEntitiesHighlighted}</pre>
        );

        if (this.props.showRawBody) {
            documentBody = (
                <pre>{this.props.raw}</pre>
            );
        }

        let recipientLinks = [];
        if (this.props.header.recipients[0] === 'NO RECIPIENTS FOUND') {
            recipientLinks = <span>No Recipients Found</span>;
        } else {
            recipientLinks = this.props.header.recipients.map(recipient => (
                <Link
                    to={`/correspondent/${recipient.identifying_name}`}
                    className="text-primary"
                    key={recipient.identifying_name}
                >
                    {recipient.identifying_name}
                </Link>
            )).reduce((previous, current) => [previous, ', ', current]);
        }
        return (
            <Card className="email-card">
                <CardHeader>
                    <Row>
                        <Col sm="12">
                            <h4>{this.props.header.subject}</h4>
                        </Col>
                        <Col sm="12" className="second-line">
                            <span className="list-badge category">{this.props.category}</span>
                            <div className="date mt-1 mr-2">{readableDate(this.props.header.date)}</div>
                            <ButtonGroup className="raw-toggle">
                                <Button
                                    active={!this.props.showRawBody}
                                    onClick={() => this.props.setBodyType('clean')}
                                    size="sm"
                                >
                                    Clean
                                </Button>
                                <Button
                                    active={this.props.showRawBody}
                                    onClick={() => this.props.setBodyType('raw')}
                                    size="sm"
                                >
                                    Raw
                                </Button>
                            </ButtonGroup>
                        </Col>
                        <Col sm="12" className="recipients">
                            {'From: '}
                            <Link
                                to={`/correspondent/${this.props.header.sender.identifying_name}`}
                                className="text-primary"
                            >
                                {this.props.header.sender.identifying_name}
                            </Link>
                            <br />
                            {'To: '}
                            {recipientLinks}
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    {documentBody}
                </CardBody>
            </Card>
        );
    }
}

EmailCard.propTypes = {
    entities: PropTypes.objectOf(PropTypes.array).isRequired,
    body: PropTypes.string.isRequired,
    raw: PropTypes.string.isRequired,
    header: PropTypes.shape({
        subject: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        sender: PropTypes.shape({
            identifying_name: PropTypes.string.isRequired,
        }).isRequired,
        recipients: PropTypes.array.isRequired,
    }).isRequired,
    showRawBody: PropTypes.bool.isRequired,
    setBodyType: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired,
};

export default EmailCard;
