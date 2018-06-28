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
                    No terms found for {this.props.identifyingName}
                </ListGroupItem>
            );
        } else {
            termElements = this.props.terms.map(term => (
                <ListGroupItem key={`${term.count}${term.entity}${term.type}`} >
                    <Link to={`/search/${term.entity}`} className="term-link">
                        <Badge className="count text-primary badge">
                            {term.count}
                        </Badge>
                        <span className="term text-ellipsis">{term.entity}</span>
                    </Link>
                </ListGroupItem>
            ));
        }

        return this.props.isFetching ? <Spinner /> : <ListGroup> { termElements } </ListGroup>;
    }
}

TermList.propTypes = {
    identifyingName: PropTypes.string.isRequired,
    terms: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
};

export default TermList;
