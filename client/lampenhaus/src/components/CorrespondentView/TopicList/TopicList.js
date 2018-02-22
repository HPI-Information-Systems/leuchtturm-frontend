/* eslint-disable */
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, Legend, Tooltip, YAxis, XAxis  } from 'recharts';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import PropTypes from 'prop-types';
import './TopicList.css';
import Spinner from '../../Spinner/Spinner';

// eslint-disable-next-line react/prefer-stateless-function
class TopicList extends Component {
    constructor(props){
        super(props)
        this.state = {
            showResults: false,
            currentTopic: null,
        };
        this.showTopic = this.showTopic.bind(this);
    }

    showTopic(topic) {
        this.setState({ showResults: true });
        this.state.currentTopic = topic
    }

    render() {
        var label_topics = this.props.topics.map((topic) => {
            return {
            confidence: topic.confidence,
            words: topic.words.map((word) => {return word.word}).join(" ")
        }})
          

        return (
            <div>
                <ResponsiveContainer width={"100%"} height={200}>
                    <BarChart data={
                        label_topics
                    }>
                        <XAxis dataKey="words"  tick={false}/>
                        <YAxis/>
                        <Tooltip />
                        <Legend verticalAlign="top" height={36}/>
                        <Bar dataKey="confidence" fill="#007bff" onClick={(topic, index) => this.showTopic(topic)} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="words">
                    { this.state.showResults ? 
                        this.state.currentTopic.words.split(" ").map(word => (
                            <span key={word}>
                                <Link to={`/search/${word}`} key={word}>
                                    <span className="word"> {word}</span>
                                </Link>
                            </span>
                        ))
                    
                    : null }
                </div>
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
