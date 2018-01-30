import React, { Component } from 'react';

import FontIcon from 'react-toolbox/lib/font_icon/FontIcon';
import styles from './moduleStyles.css';

export default class ToolboxElement extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={styles.item} onClick={this.props.onClick}>
                <FontIcon value={this.props.icon} />
                <div>{this.props.text}</div>
            </div>
        );
    }
}
