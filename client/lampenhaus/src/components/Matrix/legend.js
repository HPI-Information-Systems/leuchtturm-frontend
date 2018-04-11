import * as d3 from 'd3';

d3.svg.legend = function myLegend() {
    let legendValues = [
        { color: 'red', stop: [0, 1] },
        { color: 'blue', stop: [1, 2] },
        { color: 'purple', stop: [2, 3] },
        { color: 'yellow', stop: [3, 4] },
        { color: 'Aquamarine', stop: [4, 5] },
    ];
    let legendTexts = [];
    // eslint-disable-next-line
    let legendScale;
    let cellWidth = 30;
    let cellHeight = 20;
    // eslint-disable-next-line
    const adjustable = false;
    let labelFormat = d3.format('.01f');
    let labelUnits = 'units';
    // eslint-disable-next-line
    const lastValue = 6;
    let changeValue = 1;
    let orientation = 'horizontal';
    let cellPadding = 0;

    function legend(g) {
        function redraw() {
            g.selectAll('g.legendCells')
                .data(legendValues)
                .exit()
                .remove();
            g.selectAll('g.legendCells')
                .select('rect')
                .style('fill', d => d.color);
            if (orientation === 'vertical') {
                g.selectAll('g.legendCells')
                    .select('text.breakLabels')
                    .style('display', 'block')
                    .style('text-anchor', 'start')
                    .attr('x', cellWidth + cellPadding)
                    .attr('y', 5 + (cellHeight / 2))
                    .text(d => labelFormat(d.stop[0]) + (d.stop[1].length > 0 ? ` - ${labelFormat(d.stop[1])}` : ''));
                g.selectAll('g.legendCells')
                    .attr('transform', (d, i) => `translate(0,${i * (cellHeight + cellPadding)})`);
            } else {
                g.selectAll('g.legendCells')
                    .attr('transform', (d, i) => `translate(${i * cellWidth},0)`);
                g.selectAll('text.breakLabels')
                    .style('text-anchor', 'middle')
                    .attr('x', 0).attr('y', -7)
                    .style('display', (d, i) => (i === 0 ? 'none' : 'block'))
                    .text(d => labelFormat(d.stop[0]));
            }
        }
        // eslint-disable-next-line
        function cellRange(valuePosition, changeVal) {
            legendValues[valuePosition].stop[0] += changeVal;
            legendValues[valuePosition - 1].stop[1] += changeVal;
            redraw();
        }

        g.selectAll('g.legendCells')
            .data(legendValues)
            .enter()
            .append('g')
            .attr('class', 'legendCells')
            .attr('transform', (d, i) => `translate(${i * (cellWidth + cellPadding)},0)`);

        g.selectAll('g.legendCells')
            .append('rect')
            .attr('height', cellHeight)
            .attr('width', cellWidth)
            .style('fill', d => d.color)
            // .style('stroke', 'black')
            .style('stroke-width', '2px');


        g.selectAll('g.legendCells')
            .append('text')
            .attr('x', 30)
            .attr('y', 10)
            // .attr('class', 'breakLabels')
            .text((d, i) => legendTexts[i])
            .style('pointer-events', 'none');

        g.append('text')
            .text(labelUnits)
            .style('font-size', 15)
            .attr('y', -10);

        redraw();
    }

    legend.inputScale = function myInputScale(newScale, nodes) {
        legendTexts = nodes;
        const scale = newScale;
        if (!arguments.length) return scale;
        legendValues = [];
        if (scale.invertExtent) {
            // Is a quantile scale
            scale.range().forEach((el) => {
                const cellObject = { color: el, stop: scale.invertExtent(el) };
                legendValues.push(cellObject);
                // legendTexts.push(el);
                // legendTexts[el] = nodes[el];
            });
        } else {
            scale.domain().forEach((el) => {
                const cellObject = { color: scale(el), stop: [el, ''] };
                legendValues.push(cellObject);
                // legendTexts[el]=el;
                // legendTexts[el] = nodes[el];
            });
        }

        return this;
    };

    legend.scale = function myScale(testValue) {
        let foundColor = legendValues[legendValues.length - 1].color;
        // eslint-disable-next-line
        for (const el in legendValues) {
            if (testValue < legendValues[el].stop[1]) {
                foundColor = legendValues[el].color;
                break;
            }
        }
        return foundColor;
    };

    legend.cellWidth = function myCellWidth(newCellSize) {
        if (!arguments.length) return cellWidth;
        cellWidth = newCellSize;
        return this;
    };

    legend.cellHeight = function myCellHeight(newCellSize) {
        if (!arguments.length) return cellHeight;
        cellHeight = newCellSize;
        return this;
    };

    legend.cellPadding = function myCellPadding(newCellPadding) {
        if (!arguments.length) return cellPadding;
        cellPadding = newCellPadding;
        return this;
    };

    legend.cellExtent = function myCellExtent(incColor, newExtent) {
        const selectedStop = legendValues.filter(el => el.color === incColor)[0].stop;
        if (arguments.length === 1) return selectedStop;
        legendValues.filter(el => el.color === incColor)[0].stop = newExtent;
        return this;
    };

    legend.cellStepping = function myCellStepping(incStep) {
        if (!arguments.length) return changeValue;
        changeValue = incStep;
        return this;
    };

    legend.units = function myUnits(incUnits) {
        if (!arguments.length) return labelUnits;
        labelUnits = incUnits;
        return this;
    };

    legend.orientation = function myOrientation(incOrient) {
        if (!arguments.length) return orientation;
        orientation = incOrient;
        return this;
    };

    legend.labelFormat = function myLabelFormat(incFormat) {
        if (!arguments.length) return labelFormat;
        labelFormat = incFormat;
        if (incFormat === 'none') {
            labelFormat = inc => inc;
        }
        return this;
    };

    return legend;
};
