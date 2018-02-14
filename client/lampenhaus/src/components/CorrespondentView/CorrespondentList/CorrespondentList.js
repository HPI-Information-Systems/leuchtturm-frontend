import React, { Component } from 'react';
import { Badge, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';
import './CorrespondentList.css';

// eslint-disable-next-line react/prefer-stateless-function
class CorrespondentList extends Component {
    render() {
        let correspondentElements;

        if (this.props.correspondents.length === 0) {
            correspondentElements = (
                <ListGroupItem>
                    No correspondents found for {this.props.emailAddress}
                </ListGroupItem>
            );
        } else {
            correspondentElements = this.props.correspondents.map(correspondent => (
                <ListGroupItem
                    tag="a"
                    href={`/correspondent/${correspondent.email_address}`}
                    key={correspondent.email_address}
                >
                    <Badge color="primary" className="count">
                        {correspondent.count}
                    </Badge>
                    {correspondent.email_address}
                </ListGroupItem>
            ));
        }

        return (
            <ListGroup>
                { this.props.isFetching
                    ? (
                        <Spinner />
                    ) : correspondentElements
                }
            </ListGroup>
        );
    }
}

CorrespondentList.propTypes = {
    emailAddress: PropTypes.string.isRequired,
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
};

export default CorrespondentList;
