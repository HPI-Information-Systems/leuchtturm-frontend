import styles from './moduleStyles.css';
import getBaseUrl from '../../../utils/environment';

/**
 * @param selection - .gTexts
 * @param data - nodes
 * */
export default function enterUpdateExitTexts(selection, data) {
    const self = this;

    let texts = selection
        .selectAll('.text')
        .data(data, d => d.id);

    texts.exit()
        .remove();

    const baseUrl = getBaseUrl();
    const url = d => `${baseUrl}/correspondent/${d.props.name}`;

    const textEnter = texts.enter()
        .append('a')
        .attr('xlink:href', url)
        .append('text')
        .attr('href', url)
        .attr('class', `text ${styles.text}`)
        .attr('y', '.3em');

    texts = textEnter.merge(texts);

    texts.attr('x', d => parseInt(d.props.__radius, 10) + 6).text(d => d.props.name);
}
