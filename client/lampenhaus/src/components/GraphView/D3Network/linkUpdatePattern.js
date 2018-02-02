import styles from './moduleStyles.css';

export default function enterUpdateExitLinks(selection, data, D3Network) {
    let links = selection
        .selectAll('path')
        .data(data, d => `${d.source.id}-${d.target.id}`);

    links.exit()
        .remove();

    const linkEnter = links.enter()
        .append('path')
        .attr('class', `link ${styles.link}`)
        .style('stroke', (e) => {
            if (e.props.color) return e.props.color;
            return D3Network.props.defaultLinkColor;
        })
        .style('stroke-width', (e) => {
            if (e.props.size) return e.props.size;
            return 2;
        })
        .style('marker-end', (e) => {
            if (e.props.color) return `url(#arrow${e.props.color})`;
            return 'url(#arrow#BDBDBD)';
        });

    links = linkEnter.merge(links);
}
