import styles from './moduleStyles.css';
import { event, drag } from 'd3';

/**
 * @param selection - .gNodes
 * @param data - nodes
 * */
export default function enterUpdateExitNodes(selection, data) {
    const self = this;
    let moved = false;
    let prevSelected = false;

    // drag and drop functions
    function dragstarted(d) {
    // select or deselect nodes
        self.ctrlKey = event.sourceEvent.ctrlKey;
        prevSelected = d.selected === true;
        moved = false;
        if (!prevSelected && !self.ctrlKey) self.deselectAll();
        if (!prevSelected) self.onClickNode(d);

        if (!event.active) self.simulation.alphaTarget(0.3).restart();
    }

    function dragged(d) {
        moved = true;

        d.fx = d.fx || d.x;
        d.fy = d.fy || d.y;
        const xDiv = self.mapToXScaleInverted(event.x) - d.fx;
        const yDiv = self.mapToYScaleInverted(event.y) - d.fy;

        // move all selected nodes
        selection.selectAll('.node').each((node) => {
            if (node.selected) {
                node.fx = node.fx || node.x;
                node.fy = node.fy || node.y;
                node.x = node.fx += xDiv;
                node.y = node.fy += yDiv;
            }
        });
    }

    function dragended(d) {
        console.log('drag end');
        // select or deselect nodes
        if (!self.ctrlKey && !moved) {
            // only deselect nodes if not holding the ctrl key
            self.deselectAll();
        }
        if (!self.ctrlKey && !prevSelected && !moved) self.onClickNode(d);

        if (!event.active) self.simulation.alphaTarget(0);
    }

    // get all old nodes
    let nodes = selection
        .selectAll('.node')
        .data(data, d => d.id);

    // remove unneeded nodes
    nodes.exit()
        .remove();

    // add new nodes
    const nodeEnter = nodes.enter()
        .append('text')
        .attr('font-family', 'FontAwesome')
        .attr('class', 'node')
        .attr('name', d => d.icon)
        .text(d => d.icon)
        .call(drag()
            .subject(d => ({ x: self.mapToXScale(d.x), y: self.mapToYScale(d.y) }))
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));


    // merge old and new nodes
    nodes = nodeEnter.merge(nodes);

    // for all nodes
    nodes.style('font-size', d =>
    // set font size to radius + 10
        `${parseInt(d.props.__radius, 10) + 10}px`)
        .attr('x', '0em')
        .attr('y', d =>
            // reposition icon by half of the font size
            `${(parseInt(d.props.__radius, 10) + 10) * 0.5}px`)
        .style('fill', (d) => {
            if (d.props.__color) {
                return d.props.__color;
            }

            return '#000';
        });

    // update all nodes
    for (const key in self.props.eventListener.nodes) {
        if (self.props.eventListener.nodes.hasOwnProperty(key)) {
            nodes.on(key, self.props.eventListener.nodes[key]);
        }
    }
}
