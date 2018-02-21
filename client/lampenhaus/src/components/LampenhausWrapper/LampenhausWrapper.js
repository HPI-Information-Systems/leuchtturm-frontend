import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Lampenhaus from './Lampenhaus/Lampenhaus';
import getBaseUrl from '../../utils/environment';

class LampenhausWrapper extends Component {
    componentDidMount() {
        document.title = 'Lampenhaus';
    }

    render() {
        return (
            <Router basename={getBaseUrl()}>
                <Lampenhaus />
            </Router>
        );
    }
}

export default LampenhausWrapper;
