export default function tick(selection) {
    const nodeSelection = selection.selectAll('.gNodes .node');
    const linkSelection = selection.selectAll('.gLinks .link');
    // const arrowSelection = selection.selectAll('.gLinks .link');
    const textSelection = selection.selectAll('.gTexts .text');
    const highlightSelection = selection.selectAll('.gHighlights .highlight');
    const self = this;

    // const MAX_NODES = 240;
    const MAX_NODES = 480;
    const MAX_LINKS = MAX_NODES / 2;
    let todoNode = 0;
    let todoLink = 0;
    let restart = false;

    function moveSomeNodes() {
        let n;
        const goal = Math.min(todoNode + MAX_NODES, nodeSelection._groups[0].length);

        for (let i = todoNode; i < goal; i++) {
            n = nodeSelection._groups[0][i];
            n.setAttribute('dx', self.mapToXScale(n.__data__.x));
            n.setAttribute('dy', self.mapToYScale(n.__data__.y));
        }

        todoNode = goal;
        requestAnimationFrame(moveSome);
    }

    function moveSomeLinks() {
        let l;
        const goal = Math.min(todoLink + MAX_LINKS, linkSelection._groups[0].length);

        for (let i = todoLink; i < goal; i++) {
            l = linkSelection._groups[0][i];
            // l.setAttribute('x1', l.__data__.source.x);
            // l.setAttribute('y1', l.__data__.source.y);
            // l.setAttribute('x2', l.__data__.target.x);
            // l.setAttribute('y2', l.__data__.target.y);

            l.setAttribute(
                'd',
                `M${lineX(l.__data__)},${lineY(l.__data__)} 
        L${lineX2(l.__data__)},${lineY2(l.__data__)}`,
            );
        }

        todoLink = goal;
        requestAnimationFrame(moveSome);
    }

    function moveSome() {
        if (todoNode < nodeSelection._groups[0].length) // some more nodes to do
        { moveSomeNodes(); } else { // nodes are done
            if (todoLink < linkSelection._groups[0].length) // some more links to do
            { moveSomeLinks(); } else { // both nodes and links are done
                if (restart) {
                    restart = false;
                    todoNode = 0;
                    todoLink = 0;
                    requestAnimationFrame(moveSome);
                }
            }
        }
    }

    if (!restart) {
        restart = true;
        requestAnimationFrame(moveSome);
    }

    // nodeSelection.attr('transform', function (d) {
    //   return `translate(${self.mapToXScale(d.x)} , ${self.mapToYScale(d.y)})`;
    // });
    //
    // linkSelection.attr('d', function (d) {
    //   return 'M' + lineX(d) + ',' + lineY(d)
    //     + 'L' + lineX2(d) + ',' + lineY2(d);
    // });
    //
    textSelection.attr('transform', d => `translate(${self.mapToXScale(d.x)} , ${self.mapToYScale(d.y)})`);

    highlightSelection.attr('transform', d => `translate(${self.mapToXScale(d.x)} , ${self.mapToYScale(d.y)})`);

    // functions to set the link start and end positions
    // per default the start/end position is in the middle of a node
    // but the start/end should be a few pixels away from the node
    function lineX(d) {
        const radius = d.source.props.__radius + 3;
        const diffX = d.target.x - d.source.x;
        const diffY = d.target.y - d.source.y;
        const length = Math.sqrt(Math.pow(diffY, 2) + Math.pow(diffX, 2));
        const offset = (diffX * radius) / length;
        return self.mapToXScale(d.source.x) + offset;
    }

    function lineY(d) {
        const radius = d.source.props.__radius + 3;
        const diffX = d.target.x - d.source.x;
        const diffY = d.target.y - d.source.y;
        const length = Math.sqrt(Math.pow(diffY, 2) + Math.pow(diffX, 2));
        const offset = (diffY * radius) / length;
        return self.mapToYScale(d.source.y) + offset;
    }

    function lineX2(d) {
        const radius = d.target.props.__radius + 3;
        const length = Math.sqrt(Math.pow(d.target.y - d.source.y, 2)
      + Math.pow(d.target.x - d.source.x, 2));
        const scale = (length - radius - 5) / length;
        const offset = (d.target.x - d.source.x) - (d.target.x - d.source.x) * scale;
        return self.mapToXScale(d.target.x) - offset;
    }

    function lineY2(d) {
        const radius = d.target.props.__radius + 3;
        const length = Math.sqrt(Math.pow(d.target.y - d.source.y, 2)
      + Math.pow(d.target.x - d.source.x, 2));
        const scale = (length - radius - 5) / length;
        const offset = (d.target.y - d.source.y) - (d.target.y - d.source.y) * scale;
        return self.mapToYScale(d.target.y) - offset;
    }
}