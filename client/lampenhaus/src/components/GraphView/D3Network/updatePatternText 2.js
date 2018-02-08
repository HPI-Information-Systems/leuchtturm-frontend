import styles from './moduleStyles.css';

/**
 * @param selection - .gTexts
 * @param data - nodes
 * */
export default function enterUpdateExitTexts(selection, data) {
    let texts = selection
        .selectAll('.text')
        .data(data, d => d.id);

    texts.exit()
        .remove();

    const textEnter = texts.enter()
        .append('a')
        .attr('xlink:href', d => `/correspondent/${d.props.name}`)
        .append('text')
        .attr('class', `text ${styles.text}`)
        .attr('y', '.3em')
        .attr("text-anchor", "middle")
        .style("pointer-events", "none");

    texts = textEnter.merge(texts);

    texts.attr('x', d => parseInt(d.props.__radius, 10) + 6).text(d => d.props.name);
}
