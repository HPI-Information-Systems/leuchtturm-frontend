import React, { Fragment } from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    Col,
    Row,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    UncontrolledTooltip,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import './EmailCard.css';
import readableDate from '../../../utils/readableDate';

function EmailCard(props) {
    function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

    let allEntityNames = [];
    if (props.entities) {
        Object.keys(props.entities).forEach((entityType) => {
            allEntityNames = allEntityNames.concat(props.entities[entityType]);
        });
    }

    allEntityNames = allEntityNames.map(entityName => escapeRegExp(entityName));

    let bodyWithEntitiesHighlighted = props.body;
    if (allEntityNames.length) {
        const allEntityNamesRegExp = new RegExp(`(${allEntityNames.join('|')})`, 'gi');
        const parts = props.body.split(allEntityNamesRegExp);
        bodyWithEntitiesHighlighted = parts.map(part => (
            <span key={part}>
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

    if (props.showRawBody) {
        documentBody = (
            <pre>{props.raw}</pre>
        );
    }

    let recipientLinks = [];
    if (props.header.recipients[0] === 'NO RECIPIENTS FOUND') {
        recipientLinks = <span>No Recipients Found</span>;
    } else {
        recipientLinks = props.header.recipients.map(recipient => (
            <Link
                to={`/correspondent/${recipient.identifying_name}`}
                className="text-primary"
                key={recipient.identifying_name}
            >
                {recipient.identifying_name}
            </Link>
        )).reduce((previous, current) => [previous, ', ', current]);
    }

    let hasPredecessor = false;
    let hasSuccessor = false;
    if (props.predecessor.subject !== 'NO THREAD DATA FOUND') {
        hasPredecessor = true;
    }
    if (props.successor[0].subject !== 'NO THREAD DATA FOUND') {
        hasSuccessor = true;
    }

    let successorElement;
    if (hasSuccessor) {
        if (props.successor.length > 1) {
            successorElement = (
                <UncontrolledDropdown>
                    <DropdownToggle className="cursor-pointer" caret tag="span">
                        <span>Next emails in thread</span>
                    </DropdownToggle>
                    <DropdownMenu>
                        {props.successor.map(nextMail => (
                            <DropdownItem key={nextMail.doc_id}>
                                <Link to={`/email/${nextMail.doc_id}`} className="text-primary">
                                    {nextMail.subject}
                                    <FontAwesome name="chevron-right" className="ml-2" />
                                </Link>
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </UncontrolledDropdown>);
        } else {
            successorElement = (
                <Fragment>
                    <Link to={`/email/${props.successor[0].doc_id}`} id="successor-element" className="text-primary">
                        <span>Next email in thread</span>
                        <FontAwesome name="chevron-right" className="ml-2" />
                    </Link>
                    <UncontrolledTooltip placement="bottom" target="successor-element">
                        {props.successor[0].subject}
                    </UncontrolledTooltip>
                </Fragment>);
        }
    }

    return (
        <Card className="email-card">
            <CardHeader>
                <Row>
                    {(hasPredecessor || hasSuccessor) &&
                        <Fragment>
                            <Col sm="6" className="text-left">
                                {
                                    hasPredecessor &&
                                    <Fragment>
                                        <Link
                                            to={`/email/${props.predecessor.doc_id}`}
                                            id="predecessor-element"
                                            className="text-primary"
                                        >
                                            <FontAwesome name="chevron-left" className="mr-2" />
                                            <span>Previous email in thread</span>
                                        </Link>
                                        <UncontrolledTooltip placement="bottom" target="predecessor-element">
                                            {props.predecessor.subject}
                                        </UncontrolledTooltip>
                                    </Fragment>
                                }
                            </Col>
                            <Col sm="6" className="text-right">
                                {hasSuccessor && successorElement}
                            </Col>
                            <Col sm="12">
                                <hr className="mt-1" />
                            </Col>
                        </Fragment>
                    }
                    <Col sm="12">
                        <h4>{props.header.subject}</h4>
                    </Col>
                    <Col sm="12" className="second-line">
                        <span className="category-badge">{props.category}</span>
                        <div className="date mt-1 mr-2">{readableDate(props.header.date)}</div>
                        <ButtonGroup className="raw-toggle">
                            <Button
                                active={!props.showRawBody}
                                onClick={() => props.setBodyType('clean')}
                                size="sm"
                            >
                                Clean
                            </Button>
                            <Button
                                active={props.showRawBody}
                                onClick={() => props.setBodyType('raw')}
                                size="sm"
                            >
                                Raw
                            </Button>
                        </ButtonGroup>
                    </Col>
                    <Col sm="12" className="recipients">
                        {'From: '}
                        <Link
                            to={`/correspondent/${props.header.sender.identifying_name}`}
                            className="text-primary"
                        >
                            {props.header.sender.identifying_name}
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

EmailCard.propTypes = {
    predecessor: PropTypes.shape({
        subject: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
    }).isRequired,
    successor: PropTypes.arrayOf(PropTypes.shape({
        subject: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
    }).isRequired).isRequired,
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
