import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './TopicList.css';


// configuring Topic Space size for this component
const outerSpaceSize = 325;
const innerSpaceSize = 200;
const labelMargin = 120;
const numLabels = 3;
const topTopics = 5;
const mainBoost = 10;
const strokeWidth = 10;

// eslint-disable-next-line react/prefer-stateless-function
class TopicList extends Component {
    // shouldComponentUpdate(nextProps) {
    //     const differentTopics = this.props.main_distribution !== nextProps.main_distribution;
    //     return differentTopics;
    // }

    componentDidMount() {
        const main_distribution = this.props.topics.aggregated.topics;

        const single_distributions = this.props.topics.unaggregated

        const topics = main_distribution.map(topic =>  {
            return {
            id: topic.topic_id,
            words: topic.words,
            }
        });


        const minConfToShow = main_distribution.map(topic => topic.confidence).sort().reverse()[topTopics];

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
                topics[nodeId - 1].show = main_distribution[nodeId - 1].confidence > minConfToShow;
                topics[nodeId - 1].label = topics[nodeId - 1].words ? topics[nodeId - 1].words.slice(0, numLabels).map(word => word.word) : '';    
                topics[nodeId - 1].fillID = `fill${nodeId.toString()}`
            }
            nodeId += 1;
        }

        let nodes = [];

        nodes = nodes.concat(topics);

        const forces = [];

        main_distribution.forEach((topic) => {
            
            forces.push({
                type: 'main',
                fillID: `fill${topic.topic_id.toString()}`,
                source: topic.topic_id,
                target: 0,
                strength: topic.confidence > minConfToShow ? topic.confidence : 0,
                label: topic.words ? topic.words.slice(0, numLabels).map(word => word.word) : '',
            });
        });

        const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(forces)
        .enter()
        .append('line')
        .on('mouseenter', showOnHover)
        .on('mouseleave', hideOnLeave);

        single_distributions.forEach((distribution, index) => {
            
            nodes.push({
                type: 'single',
                id: index + topics.length,
                x: outerSpaceSize / 2,
                y: outerSpaceSize / 2,
                confidences: distribution.topics
            }   
            );

            distribution.topics.forEach((topic) => {
                // console.log(topic.confidence);
                forces.push({
                    type: 'single',
                    source: topic.topic_id,
                    target: index + topics.length,
                    strength: topic.confidence / 50,
                    label: topic.words ? topic.words.slice(0, numLabels).map(word => word.word) : '',
                });
            });

        })

        nodes.push({
            type: 'main', id: 0, x: outerSpaceSize / 2, y: outerSpaceSize / 2,
        })

        const linkForce = d3.forceLink(forces).strength(d => d.strength)
            .id(d => d.id);

        const simulation = d3.forceSimulation()
            .nodes(nodes);

        const showOnHover = function showOnHover(d) {
            d3.select(`#${d.fillID}`).attr('fill', 'black');
        };

        const hideOnLeave = function hideOnLeave(d) {
            d3.select(`#${d.fillID}`).attr('fill', 'None');
        };


        simulation
            .force('links', linkForce)
            // .force('charge', d3.forceManyBody())
                .force('r', d3.forceRadial(150, 300, 300));

        const colorDots = function colorDots(d) {
            if (d.type === 'main'){
                return '#007bff'
            }  

            else if (d.type === 'single'){
                return '#000000'
            }
            else {
                return '#ffffff'
            }
        };

        const mainSize = 10;
        const singleSize = 3;

        const resizeNodes = function resizeNodes(d) {
            if (d.type === 'main'){
                return mainSize
            }  

            else if (d.type === 'single'){
                return singleSize
            }
            else {
                return 0;
            }        
        };

        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('nodes')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', resizeNodes)
            .attr('fill', colorDots);

        const hideLabels = function hideLabels(d) {
            return d.show ? 'black' : 'None';
        };

        const fillID = function id(d) {
            return !d.show ? d.fillID : `${d.fillID}permanent`;
        };

        const text = svg.append('g')
            .attr('class', 'text')
            .selectAll('text')
            .data(topics)
            .enter()
            .append('text')
            .attr('fill', hideLabels)
            .attr('id', fillID)
            .attr('font-size', '0.8em');

        const lineHeight = '1em';

        for (let i = 0; i < numLabels; i++) {
            text.append('tspan')
                .text(d => d.label[i]).attr('dy', lineHeight).attr('x', '0');
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
                .attr('transform', d => `translate(${d.labelx.toString()},${d.labely.toString()})`);
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
    topics: PropTypes.shape({
        length: PropTypes.number.isRequired,
        aggregated: PropTypes.shape({
            topics: PropTypes.arrayOf(PropTypes.shape({
                confidence: PropTypes.number.isRequired,
                words: PropTypes.arrayOf(PropTypes.shape({
                    word: PropTypes.string.isRequired,
                    confidence: PropTypes.number.isRequired,
                })).isRequired,
            })).isRequired,
        }).isRequired,
        unaggregated: PropTypes.arrayOf({
            topics: PropTypes.arrayOf(PropTypes.shape({
                confidence: PropTypes.number.isRequired,
                words: PropTypes.arrayOf(PropTypes.shape({
                    word: PropTypes.string.isRequired,
                    confidence: PropTypes.number.isRequired,
                })).isRequired,
            })).isRequired,
        }).isRequired,
    }).isRequired,
};

export default TopicList;
