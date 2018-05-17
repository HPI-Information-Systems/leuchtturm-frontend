import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ResultListDumb from '../../ResultList/ResultListDumb';
import Spinner from '../../Spinner/Spinner';

class SimilarEmails extends Component {
    render() {

    }
}

SimilarEmails.propTypes = {
    similarEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    isFetchingSimilarEmails: PropTypes.bool.isRequired,
};

export default SimilarEmails;
