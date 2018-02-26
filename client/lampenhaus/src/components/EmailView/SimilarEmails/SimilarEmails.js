import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import ResultListDumb from '../../ResultList/ResultListDumb';
import * as actions from '../../../actions/actions';
import Spinner from '../../Spinner/Spinner';

const mapStateToProps = state => ({
    similarEmails: state.emailView.similarEmails,
    isFetchingSimilarEmails: state.emailView.isFetchingSimilarEmails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getSimilarEmails: actions.requestSimilarEmails,
}, dispatch);

class SimilarEmails extends Component {
    constructor(props) {
        super(props);
        props.getSimilarEmails(props.docId);
    }

    render() {
        let similarEmails = (
            <div>
                No similar mails found for {this.props.docId}
            </div>
        );
        if (this.props.similarEmails.length !== 0) {
            similarEmails = <ResultListDumb results={this.props.similarEmails} />;
        }

        return (
            this.props.isFetchingSimilarEmails
                ? (<Spinner />) : similarEmails
        );
    }
}

SimilarEmails.propTypes = {
    docId: PropTypes.string.isRequired,
    getSimilarEmails: PropTypes.func.isRequired,
    similarEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    isFetchingSimilarEmails: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SimilarEmails);
