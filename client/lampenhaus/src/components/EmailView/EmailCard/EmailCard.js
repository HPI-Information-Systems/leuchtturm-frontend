import React, { Component } from 'react';
import { Card, CardHeader, CardBody, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prefer-stateless-function
class EmailCard extends Component {
    render() {
        const allEntityNames = [];
        if (this.props.entities) {
            Object.keys(this.props.entities).forEach(entityType => (
                this.props.entities[entityType].forEach(entity => (
                    allEntityNames.push(entity.entity)
                ))
            ));
        }
        let [bodyWithEntitiesHighlighted] = this.props.body;
        if (allEntityNames.length) {
            const allEntityNamesRegExp = new RegExp(`(${allEntityNames.join('|')})`, 'gi');
            const parts = this.props.body[0].split(allEntityNamesRegExp);
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
                    <h5>{this.props.Subject}</h5>
                    <Link to={`/correspondent/${this.props.email[0]}`} className="text-primary">
                        From: {this.props.email[0]}
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
    entities: { 'no entities': ['No entities found'] },
    body: ['No Body found'],
    Subject: ['unknown subject'],
    email: ['unknown email address'],
};

EmailCard.propTypes = {
    className: PropTypes.string,
    entities: PropTypes.objectOf(PropTypes.array),
    body: PropTypes.arrayOf(PropTypes.string),
    Subject: PropTypes.arrayOf(PropTypes.string),
    email: PropTypes.arrayOf(PropTypes.string),
};

export default EmailCard;
