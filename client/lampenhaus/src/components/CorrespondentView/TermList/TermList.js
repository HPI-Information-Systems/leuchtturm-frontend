import React, { Component } from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
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
                <ListGroupItem key={`${term.count}${term.entity}${term.type}`} >
                    <Link to={`/search/${term.entity}`}>
                        <Badge color="primary" className="count text-ellipsis">
                            {term.count}
                        </Badge>
                        {term.entity}
                        <span className="pull-right">
                            {term.type}
                        </span>
                    </Link>
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
