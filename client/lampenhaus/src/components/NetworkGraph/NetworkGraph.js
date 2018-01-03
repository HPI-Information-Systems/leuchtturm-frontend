import { Button, ButtonGroup } from 'reactstrap';
import React, { Component } from 'react';
import { Sigma, NeoCypher, NeoGraphItemsProducers, RelativeSize,
    // keep SigmaEnableWebGL to enable webgl renderer, no explicit usage in code necessary
    // eslint-disable-next-line
    SigmaEnableWebGL } from 'react-sigma';
import ForceAtlas2 from 'react-sigma/lib/ForceAtlas2';
import './NetworkGraph.css';

const names = {};
const mails = {};

this.myProducers = new NeoGraphItemsProducers();
const myProto = Object.getPrototypeOf(this.myProducers);
const baseNodeFactory = myProto.node.bind(this.myProducers);
const baseEdgeFactory = myProto.edge.bind(this.myProducers);

class MyGraphItemsProducers {
    static node(n) {
        names[n.id] = n.properties.name;
        const x = baseNodeFactory(n);
        x.label = n.properties.email;
        x.color = '#3f4fdf';
        return x;
    }
    static edge(e) {
        const x = baseEdgeFactory(e);
        mails[e.id] = e.properties.mail_list;
        // eslint-disable-next-line
        console.log(mails);
        const [first] = e.properties.mail_list;
        x.label = first;
        x.color = '#606166';
        return x;
    }
}

// eslint-disable-next-line
class NetworkGraph extends Component {
    render() {
        return (
            <div>
                <ButtonGroup className="filter-buttons">
                    <Button>25</Button>
                    <Button>50</Button>
                    <Button>100</Button>
                    <Button>all</Button>
                </ButtonGroup>

                <Sigma
                    style={{
                        maxWidth: 'inherit',
                        height: '800px',
                        background: '#282c34',
                    }}
                    settings={{
                        drawEdges: true,
                        clone: false,
                        defaultLabelColor: '#fff',
                        defaultLabelSize: 14,
                    }}
                    // eslint-disable-next-line
                    onClickNode={e => console.log(`Mouse over node: ${e.data.node.label}`)}
                >
                    <NeoCypher
                        producers={MyGraphItemsProducers}
                        url="http://b3986.byod.hpi.de:7474"
                        user=""
                        password=""
                        query="MATCH (p:Person {email: 'alewis@enron.com'})<-[r:WRITESTO]-(s:Person) RETURN p,r,s"
                    />
                    <RelativeSize initialSize={15} />
                    <ForceAtlas2
                        randomize="globally"
                        gravity={1}
                        strong
                    />
                </Sigma>
            </div>
        );
    }
}

export default NetworkGraph;
