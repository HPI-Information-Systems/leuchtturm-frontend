import React, { Component } from 'react';
import { Button, ButtonGroup, Card, CardHeader, CardBody, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './EmailCard.css';
import readableDate from '../../../utils/readableDate';

// eslint-disable-next-line react/prefer-stateless-function
class EmailCard extends Component {
    render() {
        let allEntityNames = [];
        if (this.props.entities) {
            Object.keys(this.props.entities).forEach((entityType) => {
                allEntityNames = allEntityNames.concat(this.props.entities[entityType]);
            });
        }

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
                    to={`/correspondent/${recipient.email}`}
                    className="text-primary"
                    key={recipient.email}
                >
                    {recipient.email}
                </Link>
            )).reduce((previous, current) => [previous, ', ', current]);
        }

        return (
            <Card className="email-card">
                <CardHeader>
                    <Row>
                        <Col sm="12" className="subject-line">
                            <h4>{this.props.header.subject}</h4>
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
                                to={`/correspondent/${this.props.header.sender.emailAddress}`}
                                className="text-primary"
                            >
                                {this.props.header.sender.emailAddress}
                            </Link>
                            <br />
                            {'To: '}
                            {recipientLinks}
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Container fluid>
                        {documentBody}
                    </Container>
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
            emailAddress: PropTypes.string.isRequired,
        }).isRequired,
        recipients: PropTypes.array.isRequired,
    }).isRequired,
    showRawBody: PropTypes.bool.isRequired,
    setBodyType: PropTypes.func.isRequired,
};

export default EmailCard;
