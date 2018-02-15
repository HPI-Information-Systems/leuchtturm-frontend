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

        let [bodyWithEntitiesHighlighted] = this.props.body;
        if (allEntityNames.length) {
            const allEntityNamesRegExp = new RegExp(`(${allEntityNames.join('|')})`, 'gi');
            const parts = this.props.body.split(allEntityNamesRegExp);
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
                    <h5>{this.props.header.subject}</h5>
                    <Link to={`/correspondent/${this.props.header.sender.emailAddress}`} className="text-primary">
                        From: {this.props.header.sender.emailAddress}
                    </Link>
                </CardHeader>
                <CardBody>
                    <CardText>{bodyWithEntitiesHighlighted}</CardText>
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
    }).isRequired,
};

export default EmailCard;
