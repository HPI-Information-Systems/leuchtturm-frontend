import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './TopicSpace.css';


// configuring Topic Space size for this component
const topTopics = 4;
const strokeWidth = 10;
const mainSize = 10;
const singleSize = 3;
const simulationDurationInMs = 30000;

// eslint-disable-next-line react/prefer-stateless-function
class TopicSpace extends Component {
    componentDidMount() {
        this.createTopicSpace();
    }

    shouldComponentUpdate(nextProps) {
        return this.props.outerSpaceSize !== nextProps.outerSpaceSize;
    }

    componentDidUpdate() {
        this.createTopicSpace();
    }

    createTopicSpace() {
        this.innerSpaceSize = this.props.outerSpaceSize / 1.6;
        this.labelMargin = this.props.outerSpaceSize / 2.5;
        const numLabels = this.props.outerSpaceSize > 200 ? 5 : 2;

        const { outerSpaceSize } = this.props;
        const { innerSpaceSize } = this;
        const { labelMargin } = this;
        const mainDistribution = this.props.topics.main.topics;
        const singleDistributions = this.props.topics.singles;

        const topics = mainDistribution.map(topic =>
            ({
                id: topic.topic_id,
                words: topic.words,
            }));

        const minConfToShow = mainDistribution.map(topic => topic.confidence).sort().reverse()[topTopics];

        const maxTopic = mainDistribution.reduce((max, p) =>
            (p.confidence > max.confidence ? p : max), { confidence: 0 });

        const svg = d3.select('.TopicSpace');

        const scaleTopicSpace = d3.scaleLinear()
            .range([0, outerSpaceSize * 2])
            .domain([-1, 1]);

        const labelSpace = (outerSpaceSize * 2) - (innerSpaceSize * 2) - labelMargin;
        const scaleForLabels = d3.scaleLinear()
            .range([0, (outerSpaceSize * 2) - labelSpace])
            .domain([-1, 1]);

        let gradientAngle = 90;
        const angle = (2 * Math.PI) / topics.length;

        // 0 is reserved for correspondent
        let counter = 0;

        for (let a = 0; a < (2 * Math.PI); a += angle) {
            if (topics[counter]) {
                topics[counter].id = counter + 1;
                topics[counter].fx = scaleTopicSpace(Math.cos(a));
                topics[counter].fy = scaleTopicSpace(Math.sin(a));
                topics[counter].labelx = scaleForLabels(Math.cos(a)) + (outerSpaceSize / 20);
                topics[counter].labely = scaleForLabels(Math.sin(a)) + (outerSpaceSize / 20);
                topics[counter].show = mainDistribution[counter].confidence > minConfToShow;
                topics[counter].label = topics[counter].words ?
                    topics[counter].words.slice(0, numLabels).map(word => word.word) : '';
                topics[counter].fillID = `fill${(counter + 1).toString()}`;
                if (mainDistribution[counter].topic_id === maxTopic.topic_id) {
                    gradientAngle += (a * 360) / (2 * Math.PI);
                }
            }
            counter += 1;
        }

        svg
            .html(`
            <defs>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:rgba(0, 123, 255);stop-opacity:1" />
                    <stop offset="20%" style="stop-color:rgba(0, 123, 255);stop-opacity:0.4" />
                </linearGradient>
            </defs>
            <circle transform="rotate(${gradientAngle})"  
            transform-origin="${outerSpaceSize} ${outerSpaceSize}" stroke="url(#grad2)" 
            fill="none" class="innerSpace" cx="${(outerSpaceSize)
        .toString()}" cy="${(outerSpaceSize).toString()}" r="${(innerSpaceSize).toString()}">
            </circle>`);

        const nodes = [].concat(topics);

        const forces = [];

        mainDistribution.forEach((topic) => {
            forces.push({
                type: 'main',
                fillID: `fill${topic.topic_id.toString()}`,
                source: topic.topic_id,
                target: 0,
                strength: topic.confidence > minConfToShow ? topic.confidence : 0,
                label: topic.words ? topic.words.slice(0, numLabels).map(word => word.word) : '',
            });
        });

        const showOnHover = function showOnHover(d) {
            d3.select(`#${d.fillID}`).attr('fill', 'black');
        };

        const hideOnLeave = function hideOnLeave(d) {
            d3.select(`#${d.fillID}`).attr('fill', 'none');
        };

        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(forces)
            .enter()
            .append('line')
            .on('mouseenter', showOnHover)
            .on('mouseleave', hideOnLeave);

        singleDistributions.forEach((distribution, index) => {
            nodes.push({
                type: 'single',
                color: '#000000',
                size: singleSize,
                id: index + topics.length,
                x: outerSpaceSize,
                y: outerSpaceSize,
                confidences: distribution.topics,
                highlightId: distribution.highlightId,
            });

            distribution.topics.forEach((topic) => {
                forces.push({
                    type: 'single',
                    source: topic.topic_id,
                    target: index + topics.length,
                    strength: topic.confidence > minConfToShow ? topic.confidence : 0,
                    label: topic.words ? topic.words.slice(0, numLabels).map(word => word.word) : '',
                });
            });
        });

        nodes.push({
            type: 'main', id: 0, x: outerSpaceSize, color: '#007bff', size: mainSize, y: outerSpaceSize,
        });

        const linkForce = d3.forceLink(forces).strength(d => d.strength)
            .id(d => d.id);

        const simulation = d3.forceSimulation().nodes(nodes);

        simulation
            .force('links', linkForce);

        const colorDots = function colorDots(d) {
            return d.color;
        };

        const resizeNodes = function resizeNodes(d) {
            return d.size;
        };

        const highlightId = function highlightId(d) {
            return d.highlightId;
        };

        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('nodes')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', resizeNodes)
            .attr('data-highlight', highlightId)
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

        for (let i = 0; i <= numLabels; i++) {
            const label = text.append('tspan');
            label
                .text(d => d.label[i]).attr('dy', lineHeight).attr('x', '0');
        }

        const norm = function normx(x, y, xCoord) {
            const transformedX = x - outerSpaceSize;
            const transformedY = y - outerSpaceSize;
            const absVect = Math.sqrt((transformedX ** 2) + (transformedY ** 2));
            const desiredLength = innerSpaceSize - (2 * strokeWidth);

            if (absVect > desiredLength) {
                return xCoord ?
                    ((desiredLength * transformedX) / absVect) + outerSpaceSize :
                    ((desiredLength * transformedY) / absVect) + outerSpaceSize;
            }
            return xCoord ? x : y;
        };

        const startTime = Date.now();
        const endTime = startTime + simulationDurationInMs;

        const updatePerTick = function updatePerTick() {
            if (Date.now() < endTime) {
                node
                    .attr('cx', d => norm(d.x, d.y, true))
                    .attr('cy', d => norm(d.x, d.y, false));

                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', outerSpaceSize)
                    .attr('y2', outerSpaceSize);

                text
                    .attr('transform', d => `translate(${d.labelx.toString()},${d.labely.toString()})`);
            } else { simulation.stop(); }
        };

        simulation.on('tick', updatePerTick);
    }

    render() {
        let displayedTopics;

        if (this.props.topics.singles.length !== 0) {
            displayedTopics = (
                <svg
                    className="TopicSpace"
                    width={this.props.outerSpaceSize * 2}
                    height={this.props.outerSpaceSize * 2}
                />
            );
        } else {
            displayedTopics = (
                <div>
                    No topics to show.
                </div>
            );
        }
        return (
            displayedTopics
        );
    }
}

TopicSpace.propTypes = {
    outerSpaceSize: PropTypes.number.isRequired,
    topics: PropTypes.shape({
        main: PropTypes.shape({
            topics: PropTypes.arrayOf(PropTypes.shape({
                confidence: PropTypes.number.isRequired,
                words: PropTypes.arrayOf(PropTypes.shape({
                    word: PropTypes.string.isRequired,
                    confidence: PropTypes.number.isRequired,
                })).isRequired,
            })).isRequired,
        }).isRequired,
        singles: PropTypes.arrayOf(PropTypes.shape({
            topics: PropTypes.arrayOf(PropTypes.shape({
                confidence: PropTypes.number.isRequired,
                words: PropTypes.arrayOf(PropTypes.shape({
                    word: PropTypes.string.isRequired,
                    confidence: PropTypes.number.isRequired,
                })).isRequired,
            })).isRequired,
            doc_id: PropTypes.string,
        }).isRequired),
    }).isRequired,
};

export default TopicSpace;
