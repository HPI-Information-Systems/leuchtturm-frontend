import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Lampenhaus from './Lampenhaus/Lampenhaus';

const LampenhausWrapper = () => (
    <Router>
        <Lampenhaus />
    </Router>
);

export default LampenhausWrapper;
