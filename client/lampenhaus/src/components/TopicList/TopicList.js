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
        if(!this.props.isFetching){
            let outerSpaceSize = 650
            let confidenceThreshold = 0.01
            let topics = this.props.topics.filter(topic => topic.confidence > confidenceThreshold)
    
            // d3.select("svg").html('<svg  class="TopicSpaceFrame"></svg>');
            let svg = d3.select("svg")
    
            let scale = d3.scaleLinear()
            .range([0, outerSpaceSize])
            .domain([-1, 1]);
            
            let angle = (2 * Math.PI)/topics.length;
            var i=1;
            for(var a = 0; a<(2*Math.PI); a+=angle){
                if(topics[i-1]){
                    topics[i-1].fx = scale(Math.cos(a)) 
                    topics[i-1].fy = scale(Math.sin(a)) 
                    topics[i-1].id = i
                }
                i++;
            }
    
            let nodes = [{"person": "t", "id":0}]
            nodes = nodes.concat(topics)
    
            var forces = []
            topics.forEach(function(topic){
                forces.push(
                    {"source": topic.id, "target":0, "strength":topic.confidence}
                )
            })
            
            var link_force =  d3.forceLink(forces).strength(function(d){ return d.strength})
                .id(function(d) { return d.id; })
            
            let simulation = d3.forceSimulation()
            .nodes(nodes);
    
             let link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(forces)
            .enter().append("line")
  
            simulation.force("links",link_force).force("charge", d3.forceManyBody()).force("r", d3.forceRadial(300))
    
            function hideTopics(d){
                if(d.person){
                    return "#007bff";
                } else {
                    return "white" ;
                }
            }

            function shrinkTopics(d){
                if(d.person){
                    return 10;
                } else {
                    return 20;
                }
            }

            function addLabel(d){
                if(d.person){
                    return "";
                } else {
                    return "topicLabel";
                }
            }
            
            var node = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("nodes")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("r", shrinkTopics)
                    .attr("class", addLabel)
                    .attr("fill", hideTopics);

                // node.append("text")
                //     .attr("dx", 12)
                //     .attr("dy", ".35em")
    
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
        
    }

    render() {
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
                    <circle cx="500" cy="500" r="600" stroke-width="2" fill="rgba(0, 123, 255, 02)" />
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
