import React, { Component } from 'react';
import { Col, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import EntityList from './EntityList/EntityList';

// eslint-disable-next-line
class EmailModal extends Component {
    render() {
        const entityList = Object.keys(this.props.entities).map(entityType => (
            <EntityList
                key={entityType}
                entityType={entityType}
                entities={this.props.entities[entityType]}
            />
        ));

        const allEntityNames = [];
        Object.keys(this.props.entities).forEach(entityType => (
            this.props.entities[entityType].forEach(entity => (
                allEntityNames.push(entity.entity)
            ))
        ));

        let bodyWithEntitiesHighlighted = this.props.body[0];

        if (allEntityNames.length) {
            const regex = new RegExp(`(${allEntityNames.join('|')})`, 'g');
            const parts = this.props.body[0].split(regex);
            let key = 0;
            bodyWithEntitiesHighlighted = parts.map((part) => {
                key += 1;
                return (
                    <span key={key} >
                        {allEntityNames.includes(part) ?
                            <Link to={`/search/${part}`} className="text-primary" >
                                { part }
                            </Link> :
                            part
                        }
                    </span>
                );
            });
        }

        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.props.toggleModalOpen}
                className="modal-lg"
            >
                <ModalHeader toggle={this.props.toggleModalOpen}>
                    {this.props.subject}
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm="8">
                            {bodyWithEntitiesHighlighted}
                        </Col>
                        <Col sm="4">
                            {entityList}
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.props.toggleModalOpen}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

EmailModal.propTypes = {
    entities: PropTypes.objectOf(PropTypes.array.isRequired).isRequired,
    body: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    subject: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    isOpen: PropTypes.bool.isRequired,
    toggleModalOpen: PropTypes.func.isRequired,
};

export default EmailModal;
