import styles from './moduleStyles.css';
import { event, drag } from 'd3';

/**
 * @param selection - .gNodes
 * @param data - nodes
 * */
export default function enterUpdateExitNodes(selection, data) {
    const self = this;
    const opaqueVal = 0.3;
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
        selection.selectAll('.node').each((node) => {
            if (node.selected && self.props.layouting) {
                node.fx = undefined;
                node.fy = undefined;
            }
        });

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
        `${parseInt(d.props.__radius, 10) + 9}px`)
        .attr('x', '-12px')
        .attr('y', d =>
            // reposition icon by half of the font size
            `${(parseInt(d.props.__radius, 10) + 3) * 0.5}px`)
        .style('fill', (d) => {
            if (d.props.__color) {
                return d.props.__color;
            }

            return '#000';
        })
        .on('mouseover', (node) => {
            const links = self.network.select('.gLinks').selectAll('path');
            const linkedByIndex = {};
            links.style('stroke', (l) => {
                linkedByIndex[`${l.source.id},${l.target.id}`] = 1;
                if (l.invisible) return 'transparent';
                if (node !== l.source && node !== l.target) {
                    return self.props.defaultLinkColor;
                }
                if (l.props.__color) return l.props.__color;
                return self.props.defaultLinkColor;
            });
            links.style('stroke-opacity', l => node !== l.source && node !== l.target ? opaqueVal : 1);
            links.style('marker-end', (e) => {
                if (e.invisible) return '';
                if (node !== e.source && node !== e.target) {
                    // return '';
                    if (e.props.__color) return 'url(#opaque-arrow' + e.props.__color + ')';
                    return 'url(#opaque-arrow#BDBDBD)';
                }
                if (e.props.__color) return 'url(#arrow' + e.props.__color + ')';
                return 'url(#arrow#BDBDBD)';
            });
    
            // check the dictionary to see if nodes are linked
            function isConnected(a, b) {
                return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id] || a.id === b.id;
            }
    
            const nodes = self.network.select('.gNodes').selectAll('.node');
            nodes.style('opacity', n => isConnected(n, node) ? 1 : opaqueVal);
    
            const texts = self.network.select('.gTexts').selectAll('.text');
            texts.style('opacity', n => isConnected(n, node) ? 1 : opaqueVal);
        })
        .on('mouseout', ((node) => {
            const links = self.network.select('.gLinks').selectAll('path');
            links.style('stroke', (l) => {
                if (l.invisible) return 'transparent';
                if (l.props.__color) return l.props.__color;
                return self.props.defaultLinkColor;
            });
            links.style('stroke-opacity', l => 0.5);
            links.style('marker-end', (e) => {
                if (e.invisible) return '';
                if (e.props.__color) return 'url(#arrow' + e.props.__color + ')';
                return 'url(#arrow#BDBDBD)';
            });
            nodes.style('opacity', 1);

            const texts = self.network.select('.gTexts').selectAll('.text');
            texts.style('opacity', 1);
        }));

    // update all nodes
    for (const key in self.props.eventListener.nodes) {
        if (self.props.eventListener.nodes.hasOwnProperty(key)) {
            nodes.on(key, self.props.eventListener.nodes[key]);
        }
    }
}
