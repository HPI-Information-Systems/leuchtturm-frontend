import _ from 'lodash';

/**
 * @param selection - svg
 * @param data - links
 * */
export default function enterUpdateExitArrows(selection, data) {
    let markerColors = _.map(data, (e) => {
        if (e.props.__color) return e.props.__color;
        return '#BDBDBD';
    });
    markerColors = _.uniq(markerColors);

    let markers = selection.select('defs').selectAll('marker')
        .data(markerColors);

    markers.exit().remove();

    const markerEnter = markers.enter().append('marker');
    markerEnter
        .attr('id', color => `arrow${color}`)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('refX', 3)
        .attr('refY', 5)
        .attr('viewBox', '0 0 10 10')
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z');

    markers = markerEnter.merge(markers);
    markers.style('fill', d => d);
}
