import React, { Fragment, Component } from 'react';
import { Row, Col } from 'reactstrap';
import './Matrix.css';
import './legend';
import createMatrix from './matrix-view';

class Matrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        createMatrix();
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Col>
                        <span>Order:</span>
                        <select id="order">
                            <option value="name">By Name</option>
                            <option value="count">By Number of Links</option>
                            <option value="group">By Region</option>
                        </select>
                    </Col>
                </Row>
                <Row>
                    <div id="matrix-container" />
                </Row>
                <script type="text/javascript" src="matrix-view.js" />
            </Fragment>
        );
    }
}

export default Matrix;
