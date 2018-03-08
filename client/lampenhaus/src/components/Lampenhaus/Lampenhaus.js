import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import getBaseUrl from '../../utils/environment';
import '../../assets/global.css';
import './Lampenhaus.css';
import FullTextSearch from '../TermView/TermView';
import EmailView from '../EmailView/EmailView';
import CorrespondentView from '../CorrespondentView/CorrespondentView';
import Header from '../Header/Header';

class Lampenhaus extends Component {
    componentDidMount() {
        document.title = 'Lampenhaus';
    }

    render() {
        return (
            <Router basename={getBaseUrl()}>
                <div className="lampenhaus">
                    <Header />
                    <Route path="/search/:searchTerm" component={FullTextSearch} />
                    <Route path="/correspondent/:emailAddress" component={CorrespondentView} />
                    <Route path="/email/:docId" component={EmailView} />
                </div>
            </Router>
        );
    }
}

export default Lampenhaus;
