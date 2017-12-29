import React, { Component } from 'react';
//keep SigmaEnableWebGL to enable webgl renderer if supported by browser, no explicit usage in code necessary
import {Sigma, RelativeSize, SigmaEnableWebGL} from 'react-sigma';
import ForceLink from 'react-sigma/lib/ForceLink';

class NetworkGraph extends Component {

    render() {
        let myGraph = {nodes:[{id:"n1", label:"Alice"}, {id:"n2", label:"Rabbit"}], edges:[{id:"e1",source:"n1",target:"n2",label:"SEES"}]};
        return (
            <Sigma
                graph={myGraph} 
                style={{maxWidth:"inherit", height:"400px"}}
                settings={{drawEdges: true, clone: false}}
                onOverNode={e => console.log("Mouse over node: " + e.data.node.label)}>
            <RelativeSize initialSize={15}/>
            <ForceLink background easing="cubicInOut" randomize="globally"/>
            </Sigma>
        );
    }
}

export default NetworkGraph;