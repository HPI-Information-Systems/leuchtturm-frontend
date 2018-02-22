/* eslint-disable */
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, Legend, Tooltip, YAxis, XAxis, Label  } from 'recharts';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import PropTypes from 'prop-types';
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
        console.log(this.state.currentTopic.words)
        console.log(this.state.currentTopic.words.split(", "))
    }

    render() {
        var label_topics = this.props.topics.map((topic) => {
            return {
            confidence: topic.confidence,
            words: topic.words.map((word) => {return word.word}).join(", ")
        }})
          

        return (
            <div>
                <ResponsiveContainer width={"100%"} height={250}>
                    <BarChart data={
                        label_topics
                    }>
                        <XAxis dataKey="words"  tick={false}>
                            <Label value="any" />
                        </XAxis >
                        <YAxis/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="confidence" fill="#8884d8" onClick={(topic, index) => this.showTopic(topic)} />
                    </BarChart>
                </ResponsiveContainer>
                { this.state.showResults ? 
                    this.state.currentTopic.words.split(", ").map(word => (
                        <span key={word}>
                            <Link to={`/search/${word}`} key={word}>
                                <span className="word"> {word}</span>
                            </Link>
                        </span>
                    )).reduce((previous, current) => [previous, ', ', current])
                
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
