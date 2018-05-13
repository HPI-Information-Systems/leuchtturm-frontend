import * as d3 from 'd3';
import * as d3Legend from 'd3-svg-legend';

function labels(labelCount) {
    const legendLabels = [];
    for (let i = 0; i < labelCount; i++) {
        legendLabels.push(i);
    }
    return legendLabels;
}

function getEmailDomain(address) {
    if (address.split('@').length > 1) {
        return address.split('@')[1];
    }
    return 'z';
}

class D3Matrix {
    constructor() {
        this.margin = {
            top: 150,
            right: 180,
            bottom: 100,
            left: 140,
        };
        this.legendWidth = 140;
        this.legendMarginLeft = 10;
        this.legendMarginTop = 50;

        this.cellSize = 9;
        this.matrix = [];

        this.z = d3.scaleLinear().domain([0, 4]).clamp(true);
    }

    singleSortMatrix(value) {
        const { orders } = this;
        this.x.domain(orders[value]);
        const { x } = this;

        const t = d3.select('#matrix-container svg').transition().duration(1000);

        t.selectAll('.row')
            .attr('transform', (d, i) => `translate(0,${x(i)})`)
            .selectAll('.cell')
            .attr('x', d => x(d.x));

        t.selectAll('.column')
            .attr('transform', (d, i) => `translate(${x(i)})rotate(-90)`);
    }

    createLegend(colorScale, labelCount) {
        const { legendMarginLeft } = this;
        const { legendMarginTop } = this;
        const verticalLegend = d3Legend.legendColor()
            .orient('vertical')
            .title('Communities')
            .labels(labels(labelCount))
            .scale(colorScale)
            .cells(labelCount);

        d3.select('#matrix-container svg')
            .append('g')
            .attr('class', 'legend')
            .call(verticalLegend)
            .attr('transform', `translate(${legendMarginLeft},${legendMarginTop})`);
    }

    createMatrix(matrixData) {
        const self = this; // for d3 callbacks

        const { nodes } = matrixData;
        const { links } = matrixData;
        const { communityCount } = matrixData;
        this.nodeNum = nodes.length;

        const width = this.nodeNum * this.cellSize;
        const height = this.nodeNum * this.cellSize;
        const x = d3.scaleBand().rangeRound([0, width]);
        this.x = x;
        const { z } = this;

        // Compute index per node.
        nodes.forEach((node) => {
            this.matrix[node.index] = d3.range(this.nodeNum).map(j => ({ x: j, y: node.index, z: 0 }));
        });

        // Convert links to matrix; count character occurrences.
        links.forEach((link) => {
            this.matrix[link.source][link.target].z = 1; // correspondence exists
            this.matrix[link.source][link.target].community = link.community;
            this.matrix[link.source][link.target].id = link.id;
            nodes[link.source].count += 1;
            nodes[link.target].count += 1;
        });

        // position matrix in svg
        const svg = d3.select('#matrix-container').append('svg')
            .attr('width', width + this.margin.left + this.margin.right)
            .attr('height', height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left + this.legendWidth}, ${this.margin.top})`);

        const communityColorScale = d3.scaleLinear()
            .domain([0, communityCount / 2, communityCount])
            .interpolate(d3.interpolateHcl)
            .range(['blue', 'yellow', 'red']);

        this.createLegend(communityColorScale, communityCount);

        // Precompute the orders.
        this.orders = {
            address: d3.range(this.nodeNum).sort((a, b) => d3.ascending(nodes[a].address, nodes[b].address)),
            domain: d3.range(this.nodeNum).sort((a, b) =>
                d3.ascending(getEmailDomain(nodes[a].address), getEmailDomain(nodes[b].address))),
            count: d3.range(this.nodeNum).sort((a, b) => nodes[b].count - nodes[a].count),
            community: d3.range(this.nodeNum).sort((a, b) => nodes[a].community - nodes[b].community),
            role: d3.range(this.nodeNum).sort((a, b) => nodes[a].role - nodes[b].role),
        };

        // The default sort order.
        this.x.domain(this.orders.community);
        self.singleSortMatrix('community');

        svg.append('rect')
            .attr('class', 'background')
            .attr('width', width)
            .attr('height', height);

        function mouseover(p) {
            d3.selectAll('.row text').classed('active', (d, i) => i === p.y);
            d3.selectAll('.column text').classed('active', (d, i) => i === p.x);
        }

        function mouseout() {
            d3.selectAll('text').classed('active', false);
        }

        // add rows, columns, text
        function formatRow(row) {
            d3.select(this).selectAll('.cell')
                .data(row.filter(d => d.z))
                .enter()
                .append('rect')
                .attr('class', 'cell')
                .attr('x', d => x(d.x))
                .attr('width', x.bandwidth())
                .attr('height', x.bandwidth())
                .style('fill-opacity', d => z(d.z))
                .style('fill', d => communityColorScale(d.community))
                .on('mouseover', mouseover)
                .on('mouseout', mouseout);
        }

        const row = svg.selectAll('.row')
            .data(this.matrix)
            .enter().append('g')
            .attr('class', 'row')
            .attr('transform', (d, i) => `translate(0,${x(i)})`)
            .each(formatRow);

        row.append('line')
            .attr('x2', width);

        row.append('text')
            .attr('x', -6)
            .attr('y', x.bandwidth() / 2)
            .attr('dy', '.32em')
            .attr('text-anchor', 'end')
            .text((d, i) => nodes[i].address);

        const column = svg.selectAll('.column')
            .data(this.matrix)
            .enter().append('g')
            .attr('class', 'column')
            .attr('transform', (d, i) => `translate(${x(i)})rotate(-90)`);

        column.append('line')
            .attr('x1', -width);

        column.append('text')
            .attr('x', 6)
            .attr('y', x.bandwidth() / 2)
            .attr('dy', '.32em')
            .attr('text-anchor', 'start')
            .text((d, i) => nodes[i].address);

        // arrow function wont work here, need to stick to traditional unnamed function
        // eslint-disable-next-line
        d3.select('#order').on('change', function () {
            self.singleSortMatrix(this.value);
        });
    }

    highlightMatrix(matrixHighlighting) {
        const { z } = this;

        function highlightCells(row) {
            d3.select(this).selectAll('.cell')
                .data(row.filter(d => d.z))
                .style('fill-opacity', (d) => {
                    if (matrixHighlighting.indexOf(d.id) > -1) {
                        return z(d.z * 4);
                    }
                    return z(d.z);
                });
        }

        d3.select('#matrix-container').selectAll('.row')
            .data(this.matrix)
            .each(highlightCells);
    }
}


export default D3Matrix;
