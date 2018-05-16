import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import ResultListDumb from '../../ResultList/ResultListDumb';
import { requestSimilarEmails } from '../../../actions/emailViewActions';
import Spinner from '../../Spinner/Spinner';

const mapStateToProps = state => ({
    similarEmails: state.emailView.similarEmails,
    isFetchingSimilarEmails: state.emailView.isFetchingSimilarEmails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    requestSimilarEmails,
}, dispatch);

class SimilarEmails extends Component {
    constructor(props) {
        super(props);
        props.requestSimilarEmails(props.docId);
    }

    render() {
        let similarEmails = (
            <div>
                No similar mails found for {this.props.docId}
            </div>
        );
        if (this.props.similarEmails.length !== 0) {
            similarEmails = (<ResultListDumb
                results={this.props.similarEmails}
                hover
            />);
        }

        return (
            this.props.isFetchingSimilarEmails
                ? (<Spinner />) : similarEmails
        );
    }
}

SimilarEmails.propTypes = {
    docId: PropTypes.string.isRequired,
    requestSimilarEmails: PropTypes.func.isRequired,
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
