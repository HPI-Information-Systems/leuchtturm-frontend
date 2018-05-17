import React from 'react';
import { Col } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

const Spinner = () => (
    <Col className="text-center">
        <FontAwesome spin name="spinner" size="3x" />
    </Col>
);

export default Spinner;
