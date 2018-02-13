import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';
import { Link } from 'react-router-dom';
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
            topicElements = this.props.topics.map((topic) => {
                const wordsPerTopic = topic.words.map(word => (
                    <span>
                        <Link to={`/search/${word.word}`} key={word.word}>
                            <span className="word"> {word.word}
                            </span>
                        </Link>{'    '}
                    </span>
                ));
                return (
                    <ListGroupItem key={topic.confidence}>
                        <span className="confidence">{topic.confidence}:
                        </span> {wordsPerTopic}
                    </ListGroupItem>
                );
            });
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
