import React, { Component } from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './CorrespondentList.css';
import * as actions from '../../../actions/actions';

const mapStateToProps = state => ({
    correspondents: state.correspondent.correspondents,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getCorrespondents: actions.requestCorrespondents,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class CorrespondentList extends Component {
    componentDidUpdate(prevProps) {
        if (prevProps.emailAddress !== this.props.emailAddress) {
            this.props.getCorrespondents();
        }
    }

    render() {
        const correspondentElements = this.props.correspondents.map(correspondent => (
            <Link to={`/correspondent/${correspondent.email_address}`} key={correspondent.email_address}>
                <ListGroupItem>
                    <Badge color="primary" pill className="count">
                        {correspondent.count}
                    </Badge>
                    {correspondent.email_address}
                </ListGroupItem>
            </Link>
        ));

        return (
            <ListGroup>
                { this.props.correspondents.length === 0
                    ? (
                        <ListGroupItem>
                            No correspondents found for {this.props.emailAddress}
                        </ListGroupItem>
                    ) : correspondentElements
                }
            </ListGroup>
        );
    }
}

CorrespondentList.propTypes = {
    emailAddress: PropTypes.string.isRequired,
    getCorrespondents: PropTypes.func.isRequired,
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondentList);
