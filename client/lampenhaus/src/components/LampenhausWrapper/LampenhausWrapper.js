import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Lampenhaus from './Lampenhaus/Lampenhaus';


let baseUrl = '/';
if (process.env.NODE_ENV === 'production') {
    baseUrl = '/app';
}

const LampenhausWrapper = () => (
    <Router basename={baseUrl}>
        <Lampenhaus />
    </Router>
);

export default LampenhausWrapper;
