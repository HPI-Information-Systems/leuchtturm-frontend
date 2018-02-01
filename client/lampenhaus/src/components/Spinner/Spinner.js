import React from 'react';
import { Col, Row } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

const Spinner = () => (
    <Row>
        <Col className="text-center">
            <FontAwesome spin name="spinner" size="3x" />
        </Col>
    </Row>
);

export default Spinner;
