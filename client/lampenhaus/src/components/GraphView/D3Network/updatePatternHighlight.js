import styles from './moduleStyles.css';
import { hsl } from 'd3';

/**
 * @param selection - .gHighlights
 * @param data - nodes
 * */
export default function enterUpdateExitHighlight(selection, data) {
    const self = this;

    // get all old nodes
    let highlights = selection
        .selectAll('.highlight')
        .data(data.filter(d => d.selected === true), d =>
        // ids of nodes
            d.id);

    // remove unneeded nodes
    highlights.exit()
        .remove();

    // add new nodes
    const highlightEnter = highlights.enter()
        .append('circle')
        .attr('class', `highlight ${styles.highlight}`)
        .attr('r', d => d.props.__radius)
        .style('stroke', (d) => {
            let hslColor;
            let color = '#000';
            if (d.props.__color) color = d.props.__color;

            hslColor = hsl(color);
            // make the highlight brighter (or darker if the color can't get brighter)
            if (hslColor.l + 0.15 > 0.8) hslColor.l -= 0.15;
            else hslColor.l += 0.15;
            return hslColor;
        })
        .style('stroke-dasharray', '0px')
        .style('stroke-opacity', 0.8);

    // merge old and new nodes
    highlights = highlightEnter.merge(highlights);
}
