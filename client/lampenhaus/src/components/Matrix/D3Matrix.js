import * as d3 from 'd3';
import * as d3Legend from 'd3-svg-legend';

function labels(labelCount) {
    const legendLabels = [];
    for (let i = 0; i < labelCount; i++) {
        legendLabels.push(i);
    }
    return legendLabels;
}

class D3Matrix {
    constructor(matrixContainerId, maximized) {
        this.matrixContainer = `#${matrixContainerId}`;
        this.maximized = maximized;

        this.margin = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        };
        this.legendWidth = 0;
        this.legendMarginLeft = 0;
        this.legendMarginTop = 0;

        this.cellSize = 1.2;

        if (maximized) {
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
        }
        this.matrix = [];

        this.z = d3.scaleLinear().domain([0, 4]).clamp(true);
    }

    sortMatrix(order) {
        this.x.domain(order);
        const { x } = this;

        const t = d3.select(this.matrixContainer).select('svg').transition().duration(1000);

        t.selectAll('.row')
            .attr('transform', (d, i) => `translate(0,${x(i)})`)
            .selectAll('.cell')
            .attr('x', d => x(d.x));

        t.selectAll('.column')
            .attr('transform', (d, i) => `translate(${x(i)})rotate(-90)`);
    }

    combinedSortMatrix(value1, value2) {
        const firstOrder = d3.range(this.nodeNum).sort(this.orders[value1]);
        let currentChunk = [];
        const finalOrder = [];
        for (let i = 0; i < firstOrder.length - 1; i++) {
            const current = firstOrder[i];
            const next = firstOrder[i + 1];
            currentChunk.push(current);
            if (this.nodes[current][value1] !== this.nodes[next][value1]) {
                currentChunk.sort(this.orders[value2]);
                finalOrder.push(...currentChunk);
                currentChunk = [];
            }
        }
        // handle last element
        currentChunk.push(firstOrder[firstOrder.length - 1]);
        currentChunk.sort(this.orders[value2]);
        finalOrder.push(...currentChunk);
        this.sortMatrix(finalOrder);
    }

    singleSortMatrix(value) {
        const order = d3.range(this.nodeNum).sort(this.orders[value]);
        this.sortMatrix(order);
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

        d3.select(this.matrixContainer).select('svg')
            .append('g')
            .attr('class', 'legend')
            .call(verticalLegend)
            .attr('transform', `translate(${legendMarginLeft},${legendMarginTop})`);
    }

    createMatrix(matrixData) {
        const self = this; // for d3 callbacks

        const { maximized } = this;
        const { communityCount } = matrixData;
        const { links } = matrixData;
        this.nodes = matrixData.nodes;
        this.nodeNum = this.nodes.length;

        const width = this.nodeNum * this.cellSize;
        const height = this.nodeNum * this.cellSize;
        const x = d3.scaleBand().rangeRound([0, width]);
        this.x = x;
        const { z } = this;

        // Compute index per node.
        this.nodes.forEach((node) => {
            this.matrix[node.index] = d3.range(this.nodeNum).map(j => ({ x: j, y: node.index, z: 0 }));
        });

        // Convert links to matrix; count character occurrences.
        links.forEach((link) => {
            this.matrix[link.source][link.target].z = 1; // correspondence exists
            this.matrix[link.source][link.target].community = link.community;
            this.matrix[link.source][link.target].id = link.id;
            this.nodes[link.source].count += 1;
            this.nodes[link.target].count += 1;
        });

        // position matrix in svg
        const svg = d3.select(this.matrixContainer).append('svg')
            .attr('width', width + this.margin.left + this.margin.right)
            .attr('height', height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left + this.legendWidth}, ${this.margin.top})`);

        const communityColorScale = d3.scaleLinear()
            .domain([0, communityCount / 2, communityCount])
            .interpolate(d3.interpolateHcl)
            .range(['blue', 'yellow', 'red']);

        if (maximized) {
            this.createLegend(communityColorScale, communityCount);
        }

        // Precompute the orders.
        this.orders = {
            identifying_name: (a, b) => d3.ascending(this.nodes[a].identifying_name, this.nodes[b].identifying_name),
            count: (a, b) => this.nodes[b].count - this.nodes[a].count,
            community: (a, b) => this.nodes[a].community - this.nodes[b].community,
            role: (a, b) => this.nodes[a].role - this.nodes[b].role,
        };

        // The default sort order.
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
                .style('fill-opacity', (d) => {
                    if (maximized) {
                        return z(d.z);
                    }
                    return z(d.z * 4);
                })
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

        if (maximized) {
            row.append('text')
                .attr('x', -6)
                .attr('y', x.bandwidth() / 2)
                .attr('dy', '.32em')
                .attr('text-anchor', 'end')
                .text((d, i) => this.nodes[i].identifying_name);
        }

        const column = svg.selectAll('.column')
            .data(this.matrix)
            .enter().append('g')
            .attr('class', 'column')
            .attr('transform', (d, i) => `translate(${x(i)})rotate(-90)`);

        column.append('line')
            .attr('x1', -width);

        if (maximized) {
            column.append('text')
                .attr('x', 6)
                .attr('y', x.bandwidth() / 2)
                .attr('dy', '.32em')
                .attr('text-anchor', 'start')
                .text((d, i) => this.nodes[i].identifying_name);
        }
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

        d3.select(this.matrixContainer).selectAll('.row')
            .data(this.matrix)
            .each(highlightCells);
    }
}


export default D3Matrix;
