import React, { Fragment, Component } from 'react';
import { Modal, ModalHeader, ModalBody, Card, CardHeader, CardBody, Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as d3 from 'd3';
import { Link } from 'react-router-dom';
import { requestEmail } from '../../actions/emailViewActions';
import Spinner from '../Spinner/Spinner';
import './TopicSpace.css';
import readableDate from '../../utils/readableDate';


// configuring Topic Space size for this component
const topTopics = 10;
const strokeWidth = 10;
const mainSize = 10;
const singleSize = 4;
const simulationDurationInMs = 30000;

const mapStateToProps = state => ({
    email: state.emailView.email,
    isFetchingEmail: state.emailView.isFetchingEmail,
    hasEmailData: state.emailView.hasEmailData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    requestEmail,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class TopicSpace extends Component {
    constructor(props) {
        super(props);
        this.topicThresholdForFilter = 0;
        this.toggleEmailModal = this.toggleEmailModal.bind(this);
        this.state = {
            modal: false,
        };
        this.filterByTopic = this.filterByTopic.bind(this);
        this.getEmail = this.getEmail.bind(this);
    }

    componentDidMount() {
        this.createTopicSpace();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.outerSpaceSize !== nextProps.outerSpaceSize || this.state.modal !== nextState.modal
            || this.props.hasEmailData !== nextProps.hasEmailData;
    }

    componentDidUpdate() {
        this.createTopicSpace();
    }

    getEmail(d) {
        if (this.props.mailOnClick) {
            this.props.requestEmail(d.highlightId);
            this.toggleEmailModal();
        }
    }

    toggleEmailModal() {
        // let modalText = '';
        // d3.select(`circle[data-highlight='${d.highlightId}']`).attr('r', '8');

        this.setState({
            modal: !this.state.modal,
        });
    }

    filterByTopic(d) {
        if (this.props.handleGlobalFilterChange) {
            const { globalFilter } = this.props;

            const { topics } = this.props.topics.main;
            const idRange = [...Array(3).keys()].map(n =>
                (topics[(d.source.rank + (n - 1))].topic_id));

            globalFilter.selectedTopics = idRange;
            globalFilter.topicThreshold = 0;
            this.props.setShouldFetchData(true);
            this.props.handleGlobalFilterChange(globalFilter);
        }
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
                confidence: topic.confidence,
                rank: topic.topic_rank,
            }));

        const minConfToShow = mainDistribution.map(topic => topic.confidence).sort().reverse()[topTopics];

        this.topicThresholdForFilter = mainDistribution.map(topic => topic.confidence)
            .reduce((sum, b) => (sum + b), 0) / (topics.length * 10);

        this.topicIdRankMapForFilter = mainDistribution.map(topic => topic.confidence);

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
                topics[counter].fx = scaleTopicSpace(Math.cos(a));
                topics[counter].fy = scaleTopicSpace(Math.sin(a));
                topics[counter].labelx = scaleForLabels(Math.cos(a)) + (outerSpaceSize / 20);
                topics[counter].labely = scaleForLabels(Math.sin(a)) + (outerSpaceSize / 20);
                topics[counter].show = mainDistribution[counter].confidence > minConfToShow;
                topics[counter].label = topics[counter].words ?
                    topics[counter].words.slice(0, numLabels).map(word => word.word) : '';
                topics[counter].fillID = `fill${topics[counter].id.toString()}`;
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
                confidence: topic.confidence,
                label: topic.words ? topic.words.slice(0, numLabels).map(word => word.word) : '',
            });
        });

        const clone = function clone(selector) {
            const node = d3.select(selector).node();
            return d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
        };

        const showOnHover = function showOnHover(d) {
            const selector = !d3.select(`#${d.fillID}`).empty() ? `#${d.fillID}` : `#${d.fillID}permanent`;

            d3.select(selector).attr('fill', 'black');
            d3.select(`${selector}rect`).attr('fill', 'white');
            d3.select(`${selector}rect`).attr('stroke', 'black');

            const labelCopy = clone(selector);
            const rectCopy = clone(`${selector}rect`);

            d3.select(selector).remove();
            d3.select(`${selector}rect`).remove();

            d3.select('g.text').node().appendChild(rectCopy.node());
            d3.select('g.text').node().appendChild(labelCopy.node());
        };

        const hideOnLeave = function hideOnLeave(d) {
            const selector = !d3.select(`#${d.fillID}`).empty() ? `#${d.fillID}` : `#${d.fillID}permanent`;
            d3.select(`#${d.fillID}`).attr('fill', 'none');
            d3.select(`#${d.fillID}rect`).attr('fill', 'none');

            const labelCardColor = !d3.select(`#${d.fillID}`).empty() ?
                'none' : `rgba(0, 123, 255,${d.confidence * 30})`;

            d3.select(`${selector}rect`).attr('stroke', labelCardColor);
        };

        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(forces)
            .enter()
            .append('line')
            .on('click', this.filterByTopic)
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

        const showMail = function showMail(d) {
            d3.select(`circle[data-highlight='${d.highlightId}']`).attr('r', '8');
        };

        const hideMail = function hideMail(d) {
            d3.select(`circle[data-highlight='${d.highlightId}']`).attr('r', `${singleSize}`);
        };

        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('nodes')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', resizeNodes)
            .attr('data-highlight', highlightId)
            .on('mouseenter', showMail)
            .on('mouseleave', hideMail)
            .on('click', this.getEmail)
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
            .attr('class', 'labels')
            .attr('font-size', '1em');

        const lineHeight = '1em';

        for (let i = 0; i <= numLabels; i++) {
            const label = text.append('tspan');
            label
                .text(d => d.label[i]).attr('dy', lineHeight).attr('x', '0');
        }

        const makeLabelCards = function makeLabelCards() {
            const ctx = d3.select('g.text').node();
            text.each((label) => {
                const textElement = !d3.select(`#${label.fillID}`).empty() ?
                    d3.select(`#${label.fillID}`).node() : d3.select(`#${label.fillID}permanent`).node();


                let textHeight = 0;
                let textWidth = 0;

                if (textElement) {
                    const dimensions = textElement.getBBox();
                    textHeight = dimensions.height;
                    textWidth = dimensions.width;
                }

                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('height', textHeight + 10);
                rect.setAttribute('id', !d3.select(`#${label.fillID}`).empty() ?
                    `${label.fillID}rect` : `${label.fillID}permanentrect`);
                rect.setAttribute('class', 'rect');
                rect.setAttribute('width', textWidth + 10);
                rect.setAttribute('fill', label.show ? 'white' : 'none');
                rect.setAttribute('stroke', label.show ? `rgba(0, 123, 255,${label.confidence * 30})` : 'none');
                rect.setAttribute(
                    'transform',
                    `translate(${(label.labelx - 5).toString()},${(label.labely - 5).toString()})`,
                );
                ctx.insertBefore(rect, textElement);
            });
        };

        makeLabelCards();

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
                <div>
                    <svg
                        className="TopicSpace"
                        width={this.props.outerSpaceSize * 2}
                        height={this.props.outerSpaceSize * 2}
                    />
                </div>
            );
        }

        let modalContent;

        if (this.props.hasEmailData) {
            let recipientLinks = [];
            if (this.props.email.header.recipients[0] === 'NO RECIPIENTS FOUND') {
                recipientLinks = <span>No Recipients Found</span>;
            } else {
                recipientLinks = this.props.email.header.recipients.map(recipient => (
                    <Link
                        to={`/correspondent/${recipient.identifying_name}`}
                        className="text-primary"
                        key={recipient.identifying_name}
                    >
                        {recipient.identifying_name}
                    </Link>
                )).reduce((previous, current) => [previous, ', ', current]);
            }

            modalContent = (
                <Fragment>
                    <ModalHeader toggle={this.toggleEmailModal} />
                    <ModalBody>
                        <Card className="email-card">
                            <CardHeader>
                                <Row>
                                    <Col sm="12">
                                        <h4>{this.props.email.header.subject}</h4>
                                    </Col>
                                    <Col sm="12" className="second-line">
                                        <div className="date mt-1 mr-2">{readableDate(this.props.email.header.date)}
                                        </div>
                                    </Col>
                                    <Col sm="12" className="recipients">
                                        {'From: '}
                                        <Link
                                            to={`/correspondent/${this.props.email.header.sender.identifying_name}`}
                                            className="text-primary"
                                        >
                                            {this.props.email.header.sender.identifying_name}
                                        </Link>
                                        <br />
                                        {'To: '}
                                        {recipientLinks}
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                {<pre>{this.props.email.body}</pre>}
                            </CardBody>
                        </Card>
                    </ModalBody>
                </Fragment>
            );
        } else if (this.props.isFetchingEmail) {
            modalContent = <Spinner />;
        }
        return (
            <Fragment>
                {displayedTopics}
                <Modal isOpen={this.state.modal} toggle={this.toggleEmailModal} size="lg">
                    {modalContent}
                </Modal>
            </Fragment>
        );
    }
}

TopicSpace.propTypes = {
    mailOnClick: PropTypes.bool.isRequired,
    requestEmail: PropTypes.func.isRequired,
    isFetchingEmail: PropTypes.bool.isRequired,
    hasEmailData: PropTypes.bool.isRequired,
    email: PropTypes.shape({
        cluster: PropTypes.shape({
            number: PropTypes.string.isRequired,
            top_body_words: PropTypes.arrayOf(PropTypes.string).isRequired,
            top_subject_words: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
        topics: PropTypes.shape({
            main: PropTypes.shape({
                topics: PropTypes.arrayOf(PropTypes.shape({
                    confidence: PropTypes.number,
                    words: PropTypes.arrayOf(PropTypes.shape({
                        word: PropTypes.string,
                        confidence: PropTypes.number,
                    })),
                })),
            }),
            singles: PropTypes.arrayOf(PropTypes.shape({
                topics: PropTypes.arrayOf(PropTypes.shape({
                    confidence: PropTypes.number.isRequired,
                    words: PropTypes.arrayOf(PropTypes.shape({
                        word: PropTypes.string.isRequired,
                        confidence: PropTypes.number.isRequired,
                    })).isRequired,
                })).isRequired,
                doc_id: PropTypes.string,
            })),
        }),
        body: PropTypes.string,
        header: PropTypes.shape({
            subject: PropTypes.string,
            date: PropTypes.string.isRequired,
            sender: PropTypes.shape({
                identifying_name: PropTypes.string.isRequired,
            }).isRequired,
            recipients: PropTypes.array.isRequired,
        }),
    }).isRequired,
    globalFilter: PropTypes.shape({
        searchTerm: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        sender: PropTypes.string.isRequired,
        recipient: PropTypes.string.isRequired,
        selectedTopics: PropTypes.array.isRequired,
        topicThreshold: PropTypes.number.isRequired,
        selectedEmailClasses: PropTypes.array.isRequired,
    }),
    handleGlobalFilterChange: PropTypes.func,
    setShouldFetchData: PropTypes.func,
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

TopicSpace.defaultProps = {
    handleGlobalFilterChange: null,
    globalFilter: null,
    setShouldFetchData: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicSpace);

