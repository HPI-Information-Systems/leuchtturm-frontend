import React, { Fragment, Component } from 'react';
import { Button, ButtonGroup, Card, CardHeader, CardBody, Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
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
            <Card className={this.props.className}>
                <CardHeader>
                    {
                        (this.props.successor || this.props.predecessor) &&
                        <Fragment>
                            <Row className="text-center mt-0">
                                <Col sm="2">
                                    {
                                        this.props.successor &&
                                        <Link to={`/email/${this.props.predecessor}`} className="text-primary">
                                            <FontAwesome name="angle-left" className="mr-2" />
                                            <span>Predecessor</span>
                                        </Link>
                                    }
                                </Col>
                                <Col sm="8">
                                    <span>This email is part of a thread.</span>
                                </Col>
                                <Col sm="2">
                                    {
                                        this.props.successor &&
                                        <Link to={`/email/${this.props.successor}`} className="text-primary">
                                            <span>Successor</span>
                                            <FontAwesome name="angle-right" className="ml-2" />
                                        </Link>
                                    }
                                </Col>
                            </Row>
                            <hr className="mt-1" />
                        </Fragment>
                    }
                    <Row>
                        <Col sm="9">
                            <h5>{this.props.header.subject}</h5>
                        </Col>
                        <Col sm="3">
                            <span className="pull-right text-secondary">{readableDate(this.props.header.date)}</span>
                        </Col>
                        <Col sm="12">
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
                        <Row>
                            <Col sm="12" className="text-right">
                                <ButtonGroup>
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
                        </Row>
                        <Row>
                            <Col sm="12">
                                {documentBody}
                            </Col>
                        </Row>
                    </Container>
                </CardBody>
            </Card>
        );
    }
}

EmailCard.propTypes = {
    predecessor: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    successor: PropTypes.string.isRequired,
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
