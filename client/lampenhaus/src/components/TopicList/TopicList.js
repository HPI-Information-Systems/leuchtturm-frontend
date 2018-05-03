
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './TopicList.css';


import Spinner from '../Spinner/Spinner';

// eslint-disable-next-line react/prefer-stateless-function
class TopicList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.updateTopic = this.updateTopic.bind(this);
    }

    componentDidUpdate() {
        if (!this.props.isFetching) {
            const outerSpaceSize = 650;
            const innerSpaceSize = 400;
            const labelSpace = 100;
            const confidenceThreshold = 0.01;

            const topics = this.props.topics.filter(topic => topic.confidence > confidenceThreshold);

            d3.select('svg')
                .html('<circle class="innerSpace" cx="' + (outerSpaceSize / 2).toString + '" cy="' + (outerSpaceSize / 2).toString() + '" r="' + innerSpaceSize/2 + '"/>');
            let svg = d3.select("svg")
    
            let scaleTopicSpace = d3.scaleLinear()
            .range([0, outerSpaceSize])
            .domain([-1, 1]);

            let scaleForLabels = d3.scaleLinear()
            .range([0, outerSpaceSize-((outerSpaceSize-innerSpaceSize - labelSpace))])
            .domain([-1, 1]);
            
            let angle = (2 * Math.PI)/topics.length;

            // 0 is reserved for correspondent
            let nodeId = 1;

            for(let a = 0; a<(2*Math.PI); a+=angle){
                if(topics[nodeId-1]){
                    topics[nodeId-1].id = nodeId
                    topics[nodeId-1].fx = scaleTopicSpace(Math.cos(a)) 
                    topics[nodeId-1].fy = scaleTopicSpace(Math.sin(a)) 
                    topics[nodeId-1].labelx = scaleForLabels(Math.cos(a)) + labelSpace/2
                    topics[nodeId-1].labely = scaleForLabels(Math.sin(a)) + labelSpace/2
                }
                nodeId++;
            }
    
            let nodes = [{"type": "person", "id":0}]
            nodes = nodes.concat(topics)
    
            let forces = [];
            let numLabels = 3;

            topics.forEach(function(topic){
                forces.push(
                    {"source": topic.id,
                     "target":0,
                     "strength": topic.confidence,
                    "label": topic.words[0] ? topic.words.slice(0, numLabels).map(word => word["word"]) : "",
                    "x1": topic.labelx,
                    "y1":topic.labely}
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
  
            simulation.force("links",link_force).force("charge", d3.forceManyBody()).force("r", d3.forceRadial(0, outerSpaceSize/2, outerSpaceSize/2))
    
            function hideTopics(d){
                if(d.type == "person"){
                    return "#007bff";
                } else {
                    return "white" ;
                }
            }

            let correspondentSize = 10;

            function resizeNodes(d){
                if(d.person){
                    return 1;
                } else {
                    return correspondentSize;
                }
            }
            
            let node = svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("nodes")
                    .data(nodes)
                    .enter()
                    .append("circle")
                    .attr("r", resizeNodes)
                    .attr("fill", hideTopics);
            
            function topicX(d){
                 d.x1
            }

            function topicY(d){
                d.y1
            }

            function label(d){
                return d.label
            }
  
            let text = svg.append("g")
            .attr("class", "text")
            .selectAll("text")
            .data(forces)
            .enter().append("text")
            .attr("fill","black")
            .attr("transform","translate(" + topicX.toString() + "," + topicY.toString() + ")" )

            let lineHeight = "1.2em";

            for(let i=0; i < numLabels; i++){
                text.append('tspan').text(function(d){ return d.label[i]}).attr("dy", lineHeight).attr("x", "0")
            } 

            function update_per_tick() {
                node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
    
                link
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
                
                text
                    .attr("transform", function(d) { return ("translate(" + d.x1.toString() + "," + d.y1.toString() + ")") })
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
