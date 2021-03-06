import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// import used d3 forces
import { event, forceLink, forceManyBody, forceSimulation, forceX, forceY, scaleLinear, select, zoom } from 'd3';
// used tick function
import tick from './d3Tick';
// d3 enter update patterns
import nodeUpdatePattern from './updatePatternNodes';
import linkUpdatePattern from './updatePatternLinks';
import arrowUpdatePattern from './updatePatternArrows';
import textUpdatePattern from './updatePatternText';
import highlightUpdatePattern from './updatePatternHighlight';
// function that distributes nodes in a circle like shape
import { calcNodeWeight, copyCoords, distributeNodes } from './nodePlacement';
// functions for multiselect
import { mouseDownBrush, mouseMoveBrush, mouseUpBrush } from "./multiselect";

import _ from 'lodash';
import styles from './moduleStyles.css';

class D3Network extends Component {
    constructor(props) {
        super(props);
        this.state = { nodes: [], links: [], selectedNodeIds: [], useContextMenu: false };

        this.mapToXScale = this.mapToXScale.bind(this);
        this.mapToYScale = this.mapToYScale.bind(this);
        this.mapToXScaleInverted = this.mapToXScaleInverted.bind(this);
        this.mapToYScaleInverted = this.mapToYScaleInverted.bind(this);
        this.updateSelectedNodes = this.updateSelectedNodes.bind(this);
    }

    componentWillUnmount() {
        this.simulation.stop();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nodes === this.props.nodes && nextProps.nodePositions === this.props.nodePositions && nextProps.layouting === this.props.layouting) return;

        const self = this;
        // copy props into state because d3 manipulates nodes and links and
        // props should be immutable
        let newNodes = _.cloneDeep(nextProps.nodes);
        const newLinks = _.cloneDeep(nextProps.links);

        let oldPositions = {};
        this.simulation.nodes().forEach(node => {
            oldPositions[node.id] = node;
        });

        newNodes.forEach(function (node) {
            if (nextProps.nodePositions[node.id]) {
                const x = nextProps.nodePositions[node.id].x;
                const y = nextProps.nodePositions[node.id].y;
                node.x = node.fx = x;
                node.y = node.fy = y;
            } else if (!self.props.layouting && nextProps.layouting) {
                node.fx = undefined;
                oldPositions[node.id].fx = undefined;
                node.fy = undefined;
                oldPositions[node.id].fx = undefined;
            } else if (oldPositions[node.id]) {
                node.x = oldPositions[node.id].x;
                node.fx = oldPositions[node.id].fx;
                node.y = oldPositions[node.id].y;
                node.fy = oldPositions[node.id].fy;
            }
        });
        oldPositions = {};

        if (!nextProps.layouting && this.simulation.alpha() < 0.01) {
            this.network.select('.gNodes').each(function (d) {
                if (d) {
                    if (d.x) d.fx = d.x;
                    if (d.y) d.fy = d.y;
                }
            });
        }

        // copy coords from old nodes to new so that the network remains stable
        copyCoords(this.state.nodes, newNodes);
        calcNodeWeight(newNodes, newLinks);
        newNodes = distributeNodes(newNodes, nextProps.searchId, this.width, this.height);


        // d3 enter-update-exit pattern
        nodeUpdatePattern.bind(this)(this.network.select('.gNodes'), newNodes);
        linkUpdatePattern.bind(this)(this.network.select('.gLinks'), newLinks);
        arrowUpdatePattern.bind(this)(this.network, newLinks);
        textUpdatePattern.bind(this)(this.network.select('.gTexts'), newNodes);
        highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), newNodes);

        this.simulation.nodes(newNodes);
        this.simulation.force('link').links(newLinks);
        
        if (nextProps.layouting || !this.props.layouting) {
            this.simulation.restart();
            this.simulation.alpha(1);
        }

        this.setState({ nodes: newNodes, links: newLinks });
    }

    // need this so that react doesn't change our component
    // this disables the functions: willComponentUpdate and componentDidUpdate
    shouldComponentUpdate() {
        return false;
    }

    /**
     * one time setup of all forces and svg groups
     * */
    componentDidMount() {
        const self = this;
        this.network = select(ReactDOM.findDOMNode(this.refs.network));
        this.network.selectAll('*').remove();

        this.width = parseInt(select(`svg.${styles.network}`).style('width'), 10);
        this.height = parseInt(select(`svg.${styles.network}`).style('height'), 10);

        // append svg groups
        this.network.append('g').attr('class', 'gLinks');
        this.network.append('g').attr('class', 'gNodes');
        this.network.append('g').attr('class', 'gHighlights');
        this.network.append('g').attr('class', 'gTexts');
        this.network.append('g').attr('class', 'gBrush');
        this.network.append('defs').attr('class', 'gDevs');


        // setup forces
        const manyBodyForce = forceManyBody()
            .strength(this.props.forceStrength)
            .distanceMin(function (d) {
                return parseInt(d.props.__radius, 10) * 2;
            });

        const linkForce = forceLink()
            .id(function (d) {
                return d.id;
            })
            .distance(function (link) {
                return Math.sqrt(link.target.weight + link.source.weight) * 20;
            })
            .links(self.state.links);

        // setup simulation
        this.simulation = forceSimulation(this.state.nodes)
            .force("charge", manyBodyForce)
            .force("link", linkForce)
            .force("x", forceX().x(self.width / 2).strength(0.1))
            .force("y", forceY().y(self.height / 2).strength(0.1))
            .on('tick', () => {
                tick.bind(this)(self.network, self)
            });

        const zoomFct = zoom()
            .scaleExtent([1 / 32, 4])
            .on('zoom', function () {
                self.zoomFactor = event.transform.k;

                self.currentXScale = event.transform.rescaleX(self.xScale);
                self.currentYScale = event.transform.rescaleY(self.yScale);

                self.simulation.restart();
                self.simulation.tick();
            });

        select(`svg.${styles.network}`)
            .on('mousedown', mouseDownBrush.bind(this))
            .on('mousemove', () => {
                mouseMoveBrush.bind(this)();
                highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), this.state.nodes);
                tick.bind(this)(self.network, self);
            })
            .on('mouseup', () => {
                mouseUpBrush.bind(this)();
                select(`svg.${styles.network}`).call(zoomFct);
            })
            .call(zoomFct)
            .on('dblclick.zoom', null);

        // scales
        self.xScale = scaleLinear()
            .domain([0, self.width])
            .range([0, self.width]);
        self.yScale = scaleLinear()
            .domain([0, self.height])
            .range([0, self.height]);

        this.simulation.restart();

        let newNodes = _.cloneDeep(this.props.nodes);
        const newLinks = _.cloneDeep(this.props.links);

        // copy coords from old nodes to new so that the network remains stable
        copyCoords(this.state.nodes, newNodes);
        calcNodeWeight(newNodes, newLinks);
        newNodes = distributeNodes(newNodes, 1, this.width, this.height);


        // d3 enter-update-exit pattern
        nodeUpdatePattern.bind(this)(this.network.select('.gNodes'), newNodes);
        linkUpdatePattern.bind(this)(this.network.select('.gLinks'), newLinks);
        arrowUpdatePattern.bind(this)(this.network, newLinks);
        textUpdatePattern.bind(this)(this.network.select('.gTexts'), newNodes);
        highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), newNodes);

        this.simulation.nodes(newNodes);
        this.simulation.force('link').links(newLinks);
        this.simulation.restart();
        this.simulation.alpha(1);

        this.setState({ nodes: newNodes, links: newLinks });
    }

    updateSelectedNodes() {
        const selected = [];
        this.state.nodes.forEach(function (n) {
            if(n.selected) selected.push(n);
        });
    };

    /**
     * add nodeId to the list of all selected nodes
     * and update the highlight of all nodes
     * */
    onClickNode = function (node) {
        node.selected = !node.selected;

        // this.props.eventListener.nodes.click(node);
        this.updateSelectedNodes();
        highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), this.state.nodes);
    };

    deselectAll = function () {
        this.state.nodes.forEach(function (node) {
            node.selected = false;
        });
        highlightUpdatePattern.bind(this)(this.network.select('.gHighlights'), this.state.nodes);
    };

    mapToXScale = function (x) {
        if (this.currentXScale) return this.currentXScale(x);
        return x;
    };

    mapToXScaleInverted = function (x) {
        if (this.currentXScale) return this.currentXScale.invert(x);
        return x;
    };

    mapToYScale = function (y) {
        if (this.currentYScale) return this.currentYScale(y);
        return y;
    };

    mapToYScaleInverted = function (y) {
        if (this.currentYScale) return this.currentYScale.invert(y);
        return y;
    };

    render() {
        return (
            <div>
                <svg className={styles.network}>
                    <g id='d3Network' ref='network'/>
                </svg>
            </div>
        );
    }
}

D3Network.defaultProps = {
    forceStrength: -1800,
    defaultLinkColor: '#CCC',
};

export default D3Network;
