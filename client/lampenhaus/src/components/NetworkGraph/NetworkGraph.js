import React, { Component } from 'react';
//keep SigmaEnableWebGL to enable webgl renderer if supported by browser, no explicit usage in code necessary
// eslint-disable-next-line
import {Sigma, RelativeSize, RandomizeNodePositions, SigmaEnableWebGL} from 'react-sigma';
// import ForceLink from 'react-sigma/lib/ForceLink';

class NetworkGraph extends Component {

    render() {
        let myGraph = {nodes:[{id:"n1", label:"Alice"}, {id:"n2", label:"Rabbit"}], edges:[{id:"e1",source:"n1",target:"n2",label:"SEES"}]};
        return (
            <Sigma
                graph={myGraph}
                style={{
                    maxWidth: "inherit",
                    height: "400px",
                    background: "#282c34",
                }}
                settings={{
                    drawEdges: true,
                    clone: false,
                    defaultNodeColor: "#fff",
                    defaultLabelColor: "#fff",
                    defaultLabelSize: 16,
                }}
                onOverNode={e => console.log("Mouse over node: " + e.data.node.label)}>
            <RelativeSize initialSize={15}/>
            <RandomizeNodePositions/>
            {/* <ForceLink background easing="cubicInOut"/> */}
            </Sigma>
        );
    }
}

export default NetworkGraph;