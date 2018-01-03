import React, { Component } from 'react';
import { Sigma, NeoCypher, NeoGraphItemsProducers, RelativeSize, RandomizeNodePositions,
    // keep SigmaEnableWebGL to enable webgl renderer, no explicit usage in code necessary
    // eslint-disable-next-line
    SigmaEnableWebGL } from 'react-sigma';

this.myProducers = new NeoGraphItemsProducers();
const myProto = Object.getPrototypeOf(this.myProducers);
const baseNodeFactory = myProto.node.bind(this.myProducers);
const baseEdgeFactory = myProto.edge.bind(this.myProducers);

class MyGraphItemsProducers {
    static node(n) {
        const x = baseNodeFactory(n);
        x.label = n.properties.email;
        x.color = '#3f4fdf';
        return x;
    }
    static edge(e) {
        const x = baseEdgeFactory(e);
        // eslint-disable-next-line
        x.label = e.properties.mail_list[1];
        x.color = '#606166';
        return x;
    }
}

// eslint-disable-next-line
class NetworkGraph extends Component {
    render() {
        return (
            <Sigma
                style={{
                    maxWidth: 'inherit',
                    height: '800px',
                    background: '#282c34',
                }}
                settings={{
                    drawEdges: true,
                    clone: false,
                    defaultNodeColor: '#fff',
                    defaultLabelColor: '#fff',
                    defaultLabelSize: 14,
                }}
                // eslint-disable-next-line
                onOverNode={e => console.log(`Mouse over node: ${e.data.node.label}`)}
            >
                <NeoCypher
                    producers={MyGraphItemsProducers}
                    url="http://b3986.byod.hpi.de:7474"
                    user=""
                    password=""
                    query="MATCH p=()-[r:WRITESTO]->() RETURN p"
                />
                <RelativeSize initialSize={15} />
                <RandomizeNodePositions />
            </Sigma>
        );
    }
}

export default NetworkGraph;
