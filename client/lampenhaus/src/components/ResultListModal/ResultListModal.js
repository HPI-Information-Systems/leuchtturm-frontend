import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ResultListDumb from '../ResultList/ResultListDumb';
import './ResultListModal.css';

// eslint-disable-next-line
class ResultListModal extends Component {
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.props.toggleModalOpen}
                className="result-list-modal modal-lg"
            >
                <ModalHeader toggle={this.props.toggleModalOpen}>
                    {'From: '}
                    <Link
                        onClick={this.props.toggleModalOpen}
                        to={`/correspondent/${this.props.senderEmail}`}
                        className="text-primary"
                    >
                        {this.props.senderEmail}
                    </Link>
                    <br />
                    {'To: '}
                    <Link
                        onClick={this.props.toggleModalOpen}
                        to={`/correspondent/${this.props.recipientEmail}`}
                        className="text-primary"
                    >
                        {this.props.recipientEmail}
                    </Link>
                </ModalHeader>
                <ModalBody>
                    <ResultListDumb results={this.props.results} isFetching={this.props.isFetching} />
                </ModalBody>
            </Modal>
        );
    }
}

ResultListModal.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleModalOpen: PropTypes.func.isRequired,
    senderEmail: PropTypes.string.isRequired,
    recipientEmail: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
        doc_id: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
};

export default ResultListModal;
