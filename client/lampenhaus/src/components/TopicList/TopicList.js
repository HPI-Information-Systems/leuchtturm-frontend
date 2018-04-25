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

    componentDidUpdate(){
        let TopicSpaceSize = 500
        let num_topics = 900
        let topics = []

        d3.select("svg").html("");
        let svg = d3.select("svg")

        let scale = d3.scaleLinear()
		.range([0, TopicSpaceSize])
		.domain([-1, 1]);
        


		let angle = (2 * Math.PI)/num_topics;
		var i=0;
		for(var a = 0; a<(2*Math.PI); a+=angle){
			i++;
			topics.push({
				fx: scale(Math.cos(a)),
				fy: scale(Math.sin(a)),
				id:i
            })
        }
        var nodes =  [
            {"person": "e", "id":5},
            {"person": "f", "id":6},
            {"person": "g", "id":7},
            {"person": "h", "id":8},
        ].concat(topics) 

        var forces = [
            {"source": 1, "target": 5},
            {"source": 2, "target": 5},
            {"source": 3, "target": 5},
            {"source": 4, "target": 5},
            {"source": 1, "target": 6},
            {"source": 2, "target": 6},
            {"source": 3, "target": 6},
            {"source": 4, "target": 6},
            ]

            var link_force =  d3.forceLink(forces).strength(Math.random)
            .id(function(d) { return d.id; })
        
        let simulation = d3.forceSimulation()
        .nodes(nodes);

         let link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(forces)
        .enter().append("line")
        .attr("stroke-width", 0);    

        simulation.force("links",link_force).force("charge", d3.forceManyBody())

        function circleColour(d){
            if(d.person){
                return "blue";
            } else {
                return "red";
            }
        }
        
        var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll(".dennis")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("r", 20)
                .attr("fill", circleColour);


        function update_per_tick() {
            //update circle positions to reflect node updates on each tick of the simulation 
            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })

            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
          }
        
        simulation.on("tick", update_per_tick );
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
                <svg>
                    No topics found.
                </svg>
            );
        } else {
            displayedTopics = (
                <svg  className="TopicSpace" >

                    {/* <svg width="720" height="120">
                    </svg> */}
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
                </svg>
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
