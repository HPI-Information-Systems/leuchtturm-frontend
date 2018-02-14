import React, { Component } from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';
import './TermList.css';

// eslint-disable-next-line react/prefer-stateless-function
class TermList extends Component {
    render() {
        let termElements;

        if (this.props.terms.length === 0) {
            termElements = (
                <ListGroupItem>
                    No terms found for {this.props.emailAddress}
                </ListGroupItem>
            );
        } else {
            termElements = this.props.terms.map(term => (
                <ListGroupItem
                    tag="a"
                    href={`/search/${term.entity}`}
                    key={term.entity}
                >
                    <Badge color="primary" className="count">
                        {term.entity_count}
                    </Badge>
                    {term.entity}
                    <span className="pull-right">
                        {term.type}
                    </span>
                </ListGroupItem>
            ));
        }

        return (
            <ListGroup>
                { this.props.isFetching
                    ? (
                        <Spinner />
                    ) : termElements
                }
            </ListGroup>
        );
    }
}

TermList.propTypes = {
    emailAddress: PropTypes.string.isRequired,
    terms: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
};

export default TermList;
