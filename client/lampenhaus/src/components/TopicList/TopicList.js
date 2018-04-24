/* eslint-disable */

import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { BarChart, ResponsiveContainer, Bar, Tooltip, YAxis, XAxis } from 'recharts';
import PropTypes from 'prop-types';
import './TopicList.css';
import * as d3 from 'd3';

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

        // TODO: temporarily removes rest topic, we should remove that later
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
                    <svg width="720" height="120">
                      <circle cx="40" cy="60" r="10"></circle>
                      <circle cx="80" cy="60" r="10"></circle>
                      <circle cx="120" cy="60" r="10"></circle>
                    </svg>
                    {/* <ResponsiveContainer width="100%" height={200}>
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
                    </div> */}
                </div>
            );
            var circle = d3.selectAll("circle");
            circle.style("fill", "steelblue");
            circle.data([32, 57, 112]);
            circle.attr("r", function(d) { return Math.sqrt(d); });



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
