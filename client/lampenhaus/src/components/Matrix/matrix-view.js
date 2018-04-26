/* eslint no-param-reassign: ["error", { "props": false }] */
import * as d3 from 'd3';
// import * as d3Legend from 'd3-svg-legend';
// import getmiserables from './miserables';

function createMatrix(matrixData) {
    const matrix = [];
    const { nodes } = matrixData;
    const { links } = matrixData;
    const n = nodes.length;

    const margin = {
        top: 150,
        right: 180,
        bottom: 100,
        left: 140,
    };
    const width = n * 9;
    const height = n * 9;

    // Compute index per node.
    nodes.forEach((node) => {
        matrix[node.index] = d3.range(n).map(j => ({ x: j, y: node.index, z: 0 }));
    });

    // Convert links to matrix; count character occurrences.
    links.forEach((link) => {
        matrix[link.source][link.target].z += 1;
        nodes[link.source].count += 1;
        nodes[link.target].count += 1;
    });

    const x = d3.scaleBand().rangeRound([0, width]);
    const z = d3.scaleLinear().domain([0, 4]).clamp(true);
    const c = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(1));

    const svg = d3.select('#matrix-container').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        // .style('margin-left', `${-margin.left}px`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`); // position matrix in svg


    // TODO: Following code is for generating a legend
    // const sequentialScale = d3.scaleSequential(d3.interpolateRainbow)
    //     .domain([0, 2]);

    // const verticalLegend = d3Legend.legendColor()
    //     .orient('vertical')
    //     .title('Roles')
    //     .labels(['Bridge', 'Hub', 'Peripherie'])
    //     .scale(sequentialScale);

    // d3.selectAll('svg')
    //     .append('g')
    //     .attr('transform', `translate(${width + 130},250)`)
    //     .attr('class', 'legend')
    //     .call(verticalLegend);

    // Precompute the orders.
    function splitEmailAddress(address) {
        if (address.split('@').length > 1) {
            return address.split('@')[1];
        }
        return 'z';
    }
    const orders = {
        address: d3.range(n).sort((a, b) => d3.ascending(nodes[a].address, nodes[b].address)),
        domain: d3.range(n).sort((a, b) =>
            d3.ascending(splitEmailAddress(nodes[a].address), splitEmailAddress(nodes[b].address))),
        count: d3.range(n).sort((a, b) => nodes[b].count - nodes[a].count),
        id: d3.range(n).sort((a, b) => nodes[a].id - nodes[b].id),
    };

    // The default sort order.
    x.domain(orders.domain);

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
            .style('fill-opacity', d => z(d.z * 4))
            .style('fill', c(0))
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);
    }

    const row = svg.selectAll('.row')
        .data(matrix)
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
        .data(matrix)
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

    // from here on: sorting magic
    function order(value) {
        x.domain(orders[value]);

        const t = svg.transition().duration(1500);

        t.selectAll('.row')
            .delay((d, i) => x(i) * 4)
            .attr('transform', (d, i) => `translate(0,${x(i)})`)
            .selectAll('.cell')
            .delay(d => x(d.x) * 4)
            .attr('x', d => x(d.x));

        t.selectAll('.column')
            .delay((d, i) => x(i) * 4)
            .attr('transform', (d, i) => `translate(${x(i)})rotate(-90)`);
    }

    const timeout = setTimeout(() => {
        order('id');
        d3.select('#order').property('selectedIndex', 2).node().focus();
    }, 2000);

    // arrow function wont work here, need to stick to traditional unnamed function
    // eslint-disable-next-line
    d3.select('#order').on('change', function () {
        clearTimeout(timeout);
        order(this.value);
    });
}

function highlightMatrix(matrixHighlighting) {
    const matrix = [];
    const { nodes } = matrixHighlighting;
    const { links } = matrixHighlighting;
    const n = nodes.length;


    // Compute index per node.
    nodes.forEach((node) => {
        matrix[node.index] = d3.range(n).map(j => ({ x: j, y: node.index, z: 0 }));
    });

    // Convert links to matrix; count character occurrences.
    links.forEach((link) => {
        matrix[link.source][link.target].z += 1;
        nodes[link.source].count += 1;
        nodes[link.target].count += 1;
    });

    const z = d3.scaleLinear().domain([0, 4]).clamp(true);

    // format cells
    d3.selectAll('.cell')
        .enter()
        .style('fill-opacity', d => z(d.z * 4));
}

export { createMatrix, highlightMatrix };
