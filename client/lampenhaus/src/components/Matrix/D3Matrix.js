import * as d3 from 'd3';
import * as d3Legend from 'd3-svg-legend';

class D3Matrix {
    constructor(matrixContainerId, eventListener) {
        this.updateMatrixContainerId(matrixContainerId);
        this.eventListener = eventListener;

        this.matrix = [];
        this.colorOptions = {
            community: {
                title: 'Communities',
                count: 1,
            },
            role: {
                title: 'Roles',
                count: 1,
            },
        };

        this.z = d3.scaleLinear().domain([0, 4]).clamp(true);
    }

    updateMatrixContainerId(matrixContainerId) {
        this.matrixContainer = `#${matrixContainerId}`;
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

    createLegend(optionKey) {
        const { legendMarginLeft } = this;
        const { legendMarginTop } = this;
        const { legendWidth } = this;
        const legendContainer = d3.select('#matrix-legend-container');
        const { title } = this.colorOptions[optionKey];
        const { count } = this.colorOptions[optionKey];
        const { colorScale } = this.colorOptions[optionKey];
        const legendEntryHeight = 20;
        const legendTitleHeight = 30;

        legendContainer
            .select('svg')
            .remove();
        legendContainer
            .append('svg')
            .attr('width', legendWidth)
            .attr('height', ((count + 1) * legendEntryHeight) + legendTitleHeight + legendMarginTop);

        if (count > 0) {
            const verticalLegend = d3Legend.legendColor()
                .orient('vertical')
                .title(title)
                .labels([...new Array(count).keys()])
                .scale(colorScale)
                .cells(count);

            legendContainer
                .select('svg')
                .append('g')
                .call(verticalLegend)
                .attr('transform', `translate(${legendMarginLeft},${legendMarginTop})`);
        } else {
            legendContainer
                .select('svg')
                .append('text')
                .text(title)
                .attr('transform', `translate(${legendMarginLeft},${legendMarginTop})`);
            legendContainer
                .select('svg')
                .append('text')
                .text('None found.')
                .attr('transform', `translate(${legendMarginLeft},${legendMarginTop + legendTitleHeight})`);
        }
    }

    colorCells(optionKey) {
        const { colorScale } = this.colorOptions[optionKey];
        d3.select(this.matrixContainer)
            .select('svg')
            .selectAll('.row')
            .selectAll('.cell')
            .filter(d => d.z)
            .style('fill', d => colorScale(d[optionKey]));
    }

    createMatrix(matrixData, maximized) {
        const self = this; // for d3 callbacks

        d3.select(this.matrixContainer).select('svg').remove();
        const flexContainer = d3.select('#matrix-flex-container');
        if (flexContainer) {
            flexContainer.select('svg').remove();
        }

        if (maximized) {
            this.margin = {
                top: 150,
                right: 180,
                bottom: 100,
                left: 140,
            };
            this.legendWidth = 150;
            this.legendMarginLeft = 10;
            this.legendMarginTop = 50;

            this.cellSize = 9;
        } else {
            this.margin = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            };
            this.legendMarginLeft = 0;
            this.legendMarginTop = 0;

            this.cellSize = 1;
        }

        const communityCount = matrixData.community_count;
        this.colorOptions.community.count = communityCount;
        const roleCount = matrixData.role_count;
        this.colorOptions.role.count = roleCount;
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
            this.matrix[link.source][link.target].role = link.role;
            this.matrix[link.source][link.target].source = link.source_identifying_name;
            this.matrix[link.source][link.target].target = link.target_identifying_name;
            this.nodes[link.source].count += 1;
            this.nodes[link.target].count += 1;
        });

        // position matrix in svg
        const svg = d3.select(this.matrixContainer).append('svg')
            .attr('width', width + this.margin.left + this.margin.right)
            .attr('height', height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

        this.colorOptions.community.colorScale = d3.scaleLinear()
            .domain([0, communityCount / 2, communityCount])
            .interpolate(d3.interpolateHcl)
            .range(['blue', 'red', 'yellow']);
        const communityColorScale = this.colorOptions.community.colorScale;

        this.colorOptions.role.colorScale = d3.scaleLinear()
            .domain([0, roleCount])
            .interpolate(d3.interpolateHcl)
            .range(['blue', 'red']);

        if (maximized) {
            this.createLegend('community');
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
                .on('click', d => self.eventListener.cells.click(d.source, d.target))
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

        const column = svg.selectAll('.column')
            .data(this.matrix)
            .enter().append('g')
            .attr('class', 'column')
            .attr('transform', (d, i) => `translate(${x(i)})rotate(-90)`);

        column.append('line')
            .attr('x1', -width);

        if (maximized) {
            const rowG = row.append('g')
                .attr('class', 'row-label-group');

            rowG.append('rect')
                .attr('x', -this.margin.left)
                .attr('width', this.margin.left)
                .attr('height', 9)
                .attr('fill', 'white');

            rowG.append('text')
                .attr('x', -6)
                .attr('y', x.bandwidth() / 2)
                .attr('dy', '.32em')
                .attr('text-anchor', 'end')
                .text((d, i) => this.nodes[i].identifying_name)
                .on('click', (d, i) => this.eventListener.texts.click(this.nodes[i].identifying_name));

            const columnG = column.append('g').attr('class', 'column-label-group');

            columnG.append('rect')
                .attr('width', this.margin.top)
                .attr('height', 9)
                .attr('fill', 'white');

            columnG.append('text')
                .attr('x', 6)
                .attr('y', x.bandwidth() / 2)
                .attr('dy', '.32em')
                .attr('text-anchor', 'start')
                .text((d, i) => this.nodes[i].identifying_name)
                .on('click', (d, i) => this.eventListener.texts.click(this.nodes[i].identifying_name));

            svg.append('rect')
                .attr('id', 'label-crossing-edge')
                .attr('fill', 'white')
                .attr('x', -this.margin.left)
                .attr('y', -this.margin.top)
                .attr('width', this.margin.left)
                .attr('height', this.margin.top);

            const scrollable = d3.select(this.matrixContainer);
            scrollable.on('scroll', () => {
                scrollable
                    .selectAll('.row-label-group')
                    .attr('transform', `translate(${scrollable.property('scrollLeft')}, 0)`);
                scrollable
                    .selectAll('.column-label-group')
                    .attr('transform', `translate(${-scrollable.property('scrollTop')}, 0)`);
                scrollable
                    .select('#label-crossing-edge')
                    .attr(
                        'transform',
                        `translate(${scrollable.property('scrollLeft')}, ${scrollable.property('scrollTop')})`,
                    );
            });
        }
    }

    highlightMatrix(matrixHighlighting) {
        const { z } = this;

        function highlightCells(row) {
            const sourceName = d3.select(this).select('text').text();
            const rowHighlighting = matrixHighlighting.find(obj => obj.source === sourceName);
            if (rowHighlighting) {
                d3.select(this).selectAll('.cell')
                    .data(row.filter(d => d.z))
                    .style('fill-opacity', (d) => {
                        if (rowHighlighting.targets.some(target => target === d.target)) {
                            return z(d.z * 4);
                        }
                        return z(d.z);
                    });
            }
        }

        d3.select(this.matrixContainer).selectAll('.row')
            .data(this.matrix)
            .each(highlightCells);
    }
}


export default D3Matrix;
