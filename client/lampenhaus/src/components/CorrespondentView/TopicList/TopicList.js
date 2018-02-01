import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';
import './TopicList.css';

// eslint-disable-next-line react/prefer-stateless-function
class TopicList extends Component {
    render() {
        let topicElements;

        if (this.props.topics.length === 0) {
            topicElements = (
                <ListGroupItem>
                    No topics found for {this.props.emailAddress}
                </ListGroupItem>
            );
        } else {
            topicElements = this.props.topics.map(topic => (
                topic
            ));
        }

        return (
            <ListGroup>
                { this.props.isFetching
                    ? (
                        <Spinner />
                    ) : topicElements
                }
            </ListGroup>
        );
    }
}

TopicList.propTypes = {
    emailAddress: PropTypes.string.isRequired,
    topics: PropTypes.arrayOf(PropTypes.shape({
        propability: PropTypes.number,
        topic: PropTypes.arrayOf(PropTypes.shape({
            word: PropTypes.string.isRequired,
            propability: PropTypes.number.isRequired,
        })).isRequired,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
};


export default TopicList;
