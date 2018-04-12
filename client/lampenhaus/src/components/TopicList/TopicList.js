import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, Tooltip, YAxis, XAxis } from 'recharts';
import PropTypes from 'prop-types';
import './TopicList.css';
import Spinner from '../Spinner/Spinner';

// eslint-disable-next-line react/prefer-stateless-function
class TopicList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTopic: false,
            currentTopic: null,
        };
        this.updateTopic = this.updateTopic.bind(this);
    }

    updateTopic(topic) {
        this.setState({ showTopic: true });
        this.setState({ currentTopic: topic });
    }

    render() {
        const stringTopics = this.props.topics.map(topic => ({
            confidence: topic.confidence,
            words: topic.words.map(word => word.word).join(' '),
        }));

        stringTopics.forEach((topic) => {
            if (topic.words === '') {
                stringTopics.splice(stringTopics.indexOf(topic), 1);
            }
        });

        let displayedTopics;

        if (this.props.topics.length === 0) {
            displayedTopics = (
                <div>
                    No topics found.
                </div>
            );
        } else {
            displayedTopics = (
                <div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={
                            stringTopics
                        }
                        >
                            <XAxis dataKey="words" tick={false} />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="confidence"
                                name="Confidence"
                                fill="#007bff"
                                onClick={
                                    this.updateTopic
                                }
                            />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="words">
                        { this.state.showTopic ?
                            this.state.currentTopic.words.split(' ').map(word => (
                                <span key={word}>
                                    <Link to={`/search/${word}`} key={word}>
                                        <span className="word"> {word}</span>
                                    </Link>
                                </span>
                            )).reduce((previous, current) => [previous, ' ', current])
                            : null }
                    </div>
                </div>
            );
        }

        return (
            this.props.isFetching
                ? (<Spinner />) : displayedTopics
        );
    }
}

TopicList.propTypes = {
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
