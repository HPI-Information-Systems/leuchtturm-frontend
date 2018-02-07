import React, { Component } from 'react';
import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
class EmailCard extends Component {
    render() {
        // TODO: remove when data is automatically extended with 'unknown' fields in preprocessing
        let subject = 'unknown subject';
        let senderName = 'unknown name';
        let senderMail = 'unknown email address';
        let receiverName = senderName;
        let receiverMail = senderMail;
        let bodyWithEntitiesHighlighted = 'No Body found';
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
        if (this.props.email.body) {
            [bodyWithEntitiesHighlighted] = this.props.email.body;
        }

        const allEntityNames = [];
        if (this.props.email.entities) {
            Object.keys(this.props.email.entities).forEach(entityType => (
                this.props.email.entities[entityType].forEach(entity => (
                    allEntityNames.push(entity.entity)
                ))
            ));
        }

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
            <Card className={this.props.className}>
                <CardHeader>
                    <h5>{subject}</h5>
                    <h6>{senderHeader}</h6>
                    <h6>{receiverHeader}</h6>
                </CardHeader>
                <CardBody>
                    <CardText>{bodyWithEntitiesHighlighted}</CardText>
                </CardBody>
            </Card>
        );
    }
}

EmailCard.defaultProps = {
    className: 'email-card',
};

EmailCard.propTypes = {
    className: PropTypes.string,
    email: PropTypes.shape.isRequired,
};

export default EmailCard;
