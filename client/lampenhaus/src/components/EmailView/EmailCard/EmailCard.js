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
        const senderHeader = `From: ${senderMail} (${senderName})`;
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
                    <Link to={`/correspondent/${senderMail}`} className="text-primary">
                        {senderHeader}
                    </Link>
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
    email: PropTypes.shape({
        entities: PropTypes.objectOf(PropTypes.array.isRequired),
        body: PropTypes.arrayOf(PropTypes.string.isRequired),
        header: PropTypes.shape({
            Subject: PropTypes.arrayOf(PropTypes.string.isRequired),
            To: PropTypes.arrayOf(PropTypes.string.isRequired),
            sender: PropTypes.shape({
                name: PropTypes.arrayOf(PropTypes.string),
                email: PropTypes.arrayOf(PropTypes.string),
            }),
        }),
    }).isRequired,
};

export default EmailCard;
