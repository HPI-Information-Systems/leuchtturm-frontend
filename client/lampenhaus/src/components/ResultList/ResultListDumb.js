import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import Result from './Result/Result';

// eslint-disable-next-line
class ResultListDumb extends Component {
    render() {
        const resultElements = this.props.results.map(result => (
            <ListGroupItem key={result.doc_id}>
                <Result
                    body={result.body}
                    subject={result.header.subject}
                    doc_id={result.doc_id}
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

ResultListDumb.propTypes = {
    results: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
};

export default ResultListDumb;
