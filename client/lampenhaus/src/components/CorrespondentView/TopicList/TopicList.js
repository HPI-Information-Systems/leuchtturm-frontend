/* eslint-disable */
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, Legend, Tooltip, YAxis, XAxis, CartesianGrid  } from 'recharts';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';

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
                            <span className="word"> {word.word}</span>
                        </Link>
                    </span>
                )).reduce((previous, current) => [previous, ', ', current]);
                // generate key for topic by joining all words of topic together
                const allWordsOfTopic = topic.words.map(word => (
                    word.word
                ));
                const topicKey = allWordsOfTopic.join('');
                return (
                    <ListGroupItem key={topicKey}>
                        <Badge color="primary" className="count">
                            {topic.confidence * 100} %
                        </Badge>
                        {wordsPerTopic}
                    </ListGroupItem>
                );
            });
        }

        let data = [{ name: 'a', value: 20 }, { name: 'b', value: 3 }, { name: 'c', value: 1000 }]
        return (
                <BarChart width={730} height={250} data={
                    this.props.topics
                }>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="words" />
                    <YAxis dataKey="confidence"/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="confidence" fill="#8884d8" />
                </BarChart>

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
