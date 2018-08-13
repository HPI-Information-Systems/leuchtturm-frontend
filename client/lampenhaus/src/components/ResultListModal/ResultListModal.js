import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ResultListDumb from '../ResultList/ResultListDumb';
import './ResultListModal.css';

function ResultListModal(props) {
    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggleModalOpen}
            className="result-list-modal modal-lg"
        >
            <ModalHeader toggle={props.toggleModalOpen}>
                {'From: '}
                <Link
                    onClick={props.toggleModalOpen}
                    to={`/correspondent/${props.senderEmail}`}
                    className="text-primary"
                >
                    {props.senderEmail}
                </Link>
                <br />
                {'To: '}
                <Link
                    onClick={props.toggleModalOpen}
                    to={`/correspondent/${props.recipientEmail}`}
                    className="text-primary"
                >
                    {props.recipientEmail}
                </Link>
            </ModalHeader>
            <ModalBody>
                <ResultListDumb results={props.results} isFetching={props.isFetching} />
            </ModalBody>
        </Modal>
    );
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
