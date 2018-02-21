/* eslint-disable */
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, Legend, Tooltip, YAxis, XAxis, CartesianGrid  } from 'recharts';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';

// eslint-disable-next-line react/prefer-stateless-function
class TopicList extends Component {
    constructor(props){
        super(props)
        this.state = {showResults: false};
        this.showTopic = this.showTopic.bind(this);
    }

    showTopic(topic) {
        this.setState({ showResults: true });
        this.state.currentTopic = topic
    }

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
        var clean_topics = this.props.topics.map((topic) => {
            return {
            confidence: topic.confidence,
            words: topic.words.map((word) => {return word.word}).join(", ")
        }})
          

        return (
            <div>
                <BarChart width={730} height={250} data={
                    clean_topics
                }>
                {console.log(this)}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="words"/>
                    <YAxis/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="confidence" fill="#8884d8" onClick={(topic, index) => this.showTopic(topic)} />
                </BarChart>
                { this.state.showResults ? 
                    this.state.currentTopic
                
                : null }

            </div>
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
