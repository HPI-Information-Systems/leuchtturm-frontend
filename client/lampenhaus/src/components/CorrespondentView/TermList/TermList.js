import React, { Component } from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './TermList.css';
import * as actions from '../../../actions/actions';

const mapStateToProps = state => ({
    terms: state.correspondent.terms,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getTerms: actions.requestTerms,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class TermList extends Component {
    componentDidUpdate(prevProps) {
        if (prevProps.emailAddress !== this.props.emailAddress) {
            this.props.getTerms();
        }
    }

    render() {
        const termElements = this.props.terms.map(term => (
            <Link to={`/search/${term.entity}`} key={term.entity}>
                <ListGroupItem>
                    {term.entity}
                    <Badge color="primary" pill className="count">
                        {term.entity_count}
                    </Badge>
                    {term.type}
                </ListGroupItem>
            </Link>
        ));

        return (
            <ListGroup>
                { this.props.terms.length === 0
                    ? (
                        <ListGroupItem>
                            No terms found for {this.props.emailAddress}
                        </ListGroupItem>
                    ) : termElements
                }
            </ListGroup>
        );
    }
}

TermList.propTypes = {
    emailAddress: PropTypes.string.isRequired,
    getTerms: PropTypes.func.isRequired,
    terms: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(TermList);
