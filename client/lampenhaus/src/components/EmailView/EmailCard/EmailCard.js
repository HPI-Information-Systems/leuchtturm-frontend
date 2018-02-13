import React, { Component } from 'react';
import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
class EmailCard extends Component {
    render() {
        const allEntityNames = [];
        if (this.props.email.entities) {
            Object.keys(this.props.email.entities).forEach(entityType => (
                this.props.email.entities[entityType].forEach(entity => (
                    allEntityNames.push(entity.entity)
                ))
            ));
        }
        let [bodyWithEntitiesHighlighted] = this.props.email.body;
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
                    <h5>{this.props.email.header.Subject}</h5>
                    <Link to={`/correspondent/${this.props.email.header.sender.email[0]}`} className="text-primary">
                        From: {this.props.email.header.sender.email[0]}
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
    email: {
        entities: ['No entities found'],
        body: ['No Body found'],
        header: {
            Subject: ['unknown subject'],
            To: ['unknown receivers'],
            sender: {
                name: ['unknown name'],
                email: ['unknown email address'],
            },
        },
    },
};

EmailCard.propTypes = {
    className: PropTypes.string,
    email: PropTypes.shape({
        entities: PropTypes.objectOf(PropTypes.array),
        body: PropTypes.arrayOf(PropTypes.string),
        header: PropTypes.shape({
            Subject: PropTypes.arrayOf(PropTypes.string),
            To: PropTypes.arrayOf(PropTypes.string),
            sender: PropTypes.shape({
                name: PropTypes.arrayOf(PropTypes.string),
                email: PropTypes.arrayOf(PropTypes.string),
            }),
        }),
    }),
};

export default EmailCard;
