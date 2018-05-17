import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import Result from './Result/Result';
import Spinner from '../Spinner/Spinner';

// eslint-disable-next-line
class ResultListDumb extends Component {
    render() {
        const resultElements = this.props.results.map(result => (
            <ListGroupItem
                key={result.doc_id}
                onMouseEnter={() => {
                    d3.select(`circle[data-highlight='${result.doc_id}']`).attr('r', '8').attr('fill', 'red');
                }}
                onMouseLeave={() => {
                    d3.select(`circle[data-highlight='${result.doc_id}']`).attr('r', '3').attr('fill', 'black');
                }}
            >
                <Result
                    body={result.body}
                    subject={result.header.subject}
                    doc_id={result.doc_id}
                    date={result.header.date}
                />
            </ListGroupItem>
        ));

        let displayedEmails;

        if (this.props.results.length === 0) {
            displayedEmails = (
                <div>
                    No emails found.
                </div>
            );
        } else {
            displayedEmails = (
                <div>
                    <ListGroup>{resultElements}</ListGroup>
                </div>
            );
        }

        return (
            this.props.isFetching
                ? (<Spinner />) : displayedEmails
        );
    }
}

ResultListDumb.defaultProps = {
    isFetching: false,
};

ResultListDumb.propTypes = {
    results: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    isFetching: PropTypes.bool,
};

export default ResultListDumb;
