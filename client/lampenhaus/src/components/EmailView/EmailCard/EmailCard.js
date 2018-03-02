import React, { Component } from 'react';
import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
                    <h5>{this.props.header.subject}</h5>
                    {'From: '}
                    <Link to={`/correspondent/${this.props.header.sender.emailAddress}`} className="text-primary">
                        {this.props.header.sender.emailAddress}
                    </Link>
                    <br />
                    {'To: '}
                    {recipientLinks}
                </CardHeader>
                <CardBody>
                    <CardText><pre>{bodyWithEntitiesHighlighted}</pre></CardText>
                </CardBody>
            </Card>
        );
    }
}

EmailCard.propTypes = {
    className: PropTypes.string.isRequired,
    entities: PropTypes.objectOf(PropTypes.array).isRequired,
    body: PropTypes.string.isRequired,
    header: PropTypes.shape({
        subject: PropTypes.string.isRequired,
        sender: PropTypes.shape({
            emailAddress: PropTypes.string.isRequired,
        }).isRequired,
        recipients: PropTypes.array.isRequired,
    }).isRequired,
};

export default EmailCard;
