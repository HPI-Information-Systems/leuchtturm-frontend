import React, { Component } from 'react';
//keep SigmaEnableWebGL to enable webgl renderer if supported by browser, no explicit usage in code necessary
// eslint-disable-next-line
import {Sigma, NeoCypher, NeoGraphItemsProducers, RelativeSize, RandomizeNodePositions, SigmaEnableWebGL} from 'react-sigma';
import ForceLink from 'react-sigma/lib/ForceLink';

this.myProducers = new NeoGraphItemsProducers();
const myProto = Object.getPrototypeOf(this.myProducers);
const baseNodeFactory = myProto.node.bind(this.myProducers);
const baseEdgeFactory = myProto.edge.bind(this.myProducers);

class MyGraphItemsProducers {
    node = (n) => {
        var x = baseNodeFactory(n);
        x.label = n.properties.email;
        return x;
    }
    edge = (e) => {
        var x = baseEdgeFactory(e)
        x.label = e.properties.mail_list[1]
        return x
    }
}

class NetworkGraph extends Component {

    render() {
        return (
            <Sigma
                style={{
                    maxWidth: "inherit",
                    height: "800px",
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
                <NeoCypher
                    producers={new MyGraphItemsProducers()}
                    url="http://b3986.byod.hpi.de:7474"
                    user=""
                    password=""
                    query="MATCH p=()-[r:WRITESTO]->() RETURN p"/>
                <RelativeSize initialSize={15}/>
                <RandomizeNodePositions/>
                {/* <ForceLink background easing="cubicInOut"/> */}
            </Sigma>
        );
    }
}

export default NetworkGraph;