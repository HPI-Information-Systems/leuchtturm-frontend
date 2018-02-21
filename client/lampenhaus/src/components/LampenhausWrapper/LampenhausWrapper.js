import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Lampenhaus from './Lampenhaus/Lampenhaus';
import getBaseUrl from '../../utils/environment';

const LampenhausWrapper = () => (
    <Router basename={getBaseUrl()}>
        <Lampenhaus />
    </Router>
);

export default LampenhausWrapper;
