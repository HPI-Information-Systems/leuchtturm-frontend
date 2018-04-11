import React, { Fragment, Component } from 'react';
import './Matrix.css';
import './legend';
import './matrix-view';

class Matrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Fragment>
                <section
                    id="matrix-container"
                    style={{
                        float: 'left',
                        width: '750px',
                    }}
                />
                <aside style={{
                    'font-style': 'italic',
                    float: 'right',
                    width: '250px',
                    border: '1px solid',
                    margin: '5em auto auto auto',
                }}
                >
                    <span>Order:</span>
                    <select id="order">
                        <option value="name">By Name</option>
                        <option value="count">By Number of Links</option>
                        <option value="group">By Region</option>
                    </select>
                </aside>
                <script type="text/javascript" src="matrix-view.js" />
            </Fragment>
        );
    }
}

export default Matrix;
