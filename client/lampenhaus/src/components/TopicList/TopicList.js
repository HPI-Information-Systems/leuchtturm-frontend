import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './TopicList.css';


// configuring Topic Space size for this component
const outerSpaceSize = 650;
const innerSpaceSize = 400;
const labelMargin = 120;
const confidenceThreshold = 0.01;
const numLabels = 3;

// eslint-disable-next-line react/prefer-stateless-function
class TopicList extends Component {
    // shouldComponentUpdate(nextProps) {
    //     const differentTopics = this.props.topics !== nextProps.topics;
    //     return differentTopics;
    // }

    componentDidMount() {
        const topics = this.props.topics.filter(topic => topic.confidence > confidenceThreshold);

        const svg = d3.select('svg');

        svg
            .html(`<circle class="innerSpace" cx="${(outerSpaceSize / 2)
                .toString()}" cy="${(outerSpaceSize / 2).toString()}" r="${(innerSpaceSize / 2).toString()}"/>`);

        const scaleTopicSpace = d3.scaleLinear()
            .range([0, outerSpaceSize])
            .domain([-1, 1]);

        const labelSpace = outerSpaceSize - innerSpaceSize - labelMargin;
        const scaleForLabels = d3.scaleLinear()
            .range([0, outerSpaceSize - labelSpace])
            .domain([-1, 1]);

        const angle = (2 * Math.PI) / topics.length;

        // 0 is reserved for correspondent
        let nodeId = 1;

        for (let a = 0; a < (2 * Math.PI); a += angle) {
            if (topics[nodeId - 1]) {
                topics[nodeId - 1].id = nodeId;
                topics[nodeId - 1].fx = scaleTopicSpace(Math.cos(a));
                topics[nodeId - 1].fy = scaleTopicSpace(Math.sin(a));
                topics[nodeId - 1].labelx = scaleForLabels(Math.cos(a)) + 20;
                topics[nodeId - 1].labely = scaleForLabels(Math.sin(a)) + 20;
            }
            nodeId += 1;
        }

        let nodes = [{ type: 'person', id: 0 }];
        nodes = nodes.concat(topics);

        const forces = [];

        topics.forEach((topic) => {
            forces.push({
                source: topic.id,
                target: 0,
                strength: topic.confidence,
                label: topic.words[0] ? topic.words.slice(0, numLabels).map(word => word.word) : '',
                x1: topic.labelx,
                y1: topic.labely,
            });
        });

        const linkForce = d3.forceLink(forces).strength(d => d.strength)
            .id(d => d.id);

        const simulation = d3.forceSimulation()
            .nodes(nodes);

        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(forces)
            .enter()
            .append('line');

        simulation
            .force('links', linkForce)
            .force('charge', d3.forceManyBody());

        const hideTopics = function hideTopics(d) {
            return d.type === 'person' ? '#007bff' : 'white';
        };

        const correspondentSize = 10;

        const resizeNodes = function resizeNodes(d) {
            return d.type === 'person' ? correspondentSize : 1;
        };

        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('nodes')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', resizeNodes)
            .attr('fill', hideTopics);

        const topicX = function topicX(d) {
            return d.x1;
        };

        const topicY = function topicY(d) {
            return d.y1;
        };

        const text = svg.append('g')
            .attr('class', 'text')
            .selectAll('text')
            .data(forces)
            .enter()
            .append('text')
            .attr('fill', 'black')
            .attr('transform', `translate(${topicX.toString()},${topicY.toString()})`);

        const lineHeight = '1.2em';

        for (let i = 0; i < numLabels; i++) {
            text.append('tspan')
                .text(d => d.label[i] || (i === 0 ? 'Rest' : '')).attr('dy', lineHeight).attr('x', '0');
        }

        const updatePerTick = function updatePerTick() {
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            text
                .attr('transform', d => `translate(${d.x1.toString()},${d.y1.toString()})`);
        };

        simulation.on('tick', updatePerTick);
    }

    render() {
        let displayedTopics;

        if (this.props.topics.length === 0) {
            displayedTopics = (
                <svg className="TopicSpace" />
            );
        } else {
            displayedTopics = (
                <svg className="TopicSpace" />
            );
        }
        return (
            displayedTopics
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
};

export default TopicList;
