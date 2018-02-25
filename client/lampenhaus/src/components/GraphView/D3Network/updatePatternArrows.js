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
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('refX', 15)
        .attr('refY', 10)
        .attr('viewBox', '0 0 20 20')
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 20 10 L 0 20 z');

    markers = markerEnter.merge(markers);
    markers.style('fill', d => d);
}
