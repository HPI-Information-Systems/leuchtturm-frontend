import styles from './moduleStyles.css';

/**
 * @param selection - .gLinks
 * @param data - links
 * */
export default function enterUpdateExitLinks(selection, data) {
    const self = this;

    let links = selection
        .selectAll('path')
        .data(data, d => `${d.source.id}-${d.target.id}`);

    links.exit()
        .remove();

    const linkEnter = links.enter()
        .append('path')
        .attr('class', `link ${styles.link}`)
        .style('stroke', (e) => {
            if (e.props.__color) return e.props.__color;
            return self.props.defaultLinkColor;
        })
        .style('stroke-width', (e) => {
            if (e.props.size) return e.props.size;
            return 2;
        })
        .style('marker-end', (e) => {
            if (e.props.__color) return `url(#arrow${e.props.__color})`;
            return 'url(#arrow#BDBDBD)';
        });

    links = linkEnter.merge(links);
}
