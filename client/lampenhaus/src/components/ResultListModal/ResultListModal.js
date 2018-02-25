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
                        to={`/correspondent/${this.props.receiverEmail}`}
                        className="text-primary"
                    >
                        {this.props.receiverEmail}
                    </Link>
                </ModalHeader>
                <ModalBody>
                    <ResultListDumb results={this.props.results} />
                </ModalBody>
            </Modal>
        );
    }
}

ResultListModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleModalOpen: PropTypes.func.isRequired,
    senderEmail: PropTypes.string.isRequired,
    receiverEmail: PropTypes.string.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
        doc_id: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
};

export default ResultListModal;
