import { Link } from 'react-router-dom';
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
            topicElements = this.props.topics.map((topic) => {
                const wordsPerTopic = topic.words.map(word => (
                    <span key={word.word}>
                        <Link to={`/search/${word.word}`} key={word.word}>
                            <span className="word"> {word.word}
                            </span>
                        </Link>{'    '}
                    </span>
                ));
                // generate key for topic by joining all words of topic together
                const allWordsOfTopic = topic.words.map(word => (
                    word.word
                ));
                const topicKey = allWordsOfTopic.join('');
                return (
                    <ListGroupItem key={topicKey}>
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
        confidence: PropTypes.number.isRequired,
        words: PropTypes.arrayOf(PropTypes.shape({
            word: PropTypes.string.isRequired,
            confidence: PropTypes.number.isRequired,
        })).isRequired,
    })).isRequired,
    isFetching: PropTypes.bool.isRequired,
};


export default TopicList;
