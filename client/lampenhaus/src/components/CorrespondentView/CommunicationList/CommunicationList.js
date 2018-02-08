import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Email from './Email/Email';

class CommunicationList extends Component {
    render() {
        const resultElements = this.props.results.map(result => (
            <ListGroupItem key={result.doc_id[0]}>
                <Email
                    body={result.body}
                    entities={result.entities}
                    subject={result.header.Subject}
                />
            </ListGroupItem>
        ));

        return (
            <div>
                {this.props.results.length > 0 &&
                <ListGroup>{resultElements}</ListGroup>
                }
                <br />
            </div>
        );
    }
}

CommunicationList.propTypes = {
    communication: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.arrayOf(PropTypes.string.isRequired),
        raw: PropTypes.arrayOf(PropTypes.string.isRequired),
        doc_id: PropTypes.arrayOf(PropTypes.string.isRequired),
        entities: PropTypes.object,
    })).isRequired,
};

export default CommunicationList;
