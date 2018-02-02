import React, { Component } from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
                <Link to={`/search/${term.entity}`} key={term.entity}>
                    <ListGroupItem>
                        {term.entity}
                        <Badge color="primary" className="count">
                            {term.entity_count}
                        </Badge>
                        {term.type}
                    </ListGroupItem>
                </Link>
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

TermList.defaultProps = {
    isFetching: true,
};

TermList.propTypes = {
    emailAddress: PropTypes.string.isRequired,
    terms: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    isFetching: PropTypes.bool,
};

export default TermList;
