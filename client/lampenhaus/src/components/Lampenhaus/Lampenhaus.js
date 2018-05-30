import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getBaseUrl } from '../../utils/environment';
import '../../assets/global.css';
import './Lampenhaus.css';
import EmailListView from '../EmailListView/EmailListView';
import EmailView from '../EmailView/EmailView';
import CorrespondentView from '../CorrespondentView/CorrespondentView';
import Header from '../Header/Header';
import ErrorLighthouse from '../ErrorLighthouse/ErrorLighthouse';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const mapStateToProps = state => ({
    selectedDataset: state.datasets.selectedDataset,
});

class Lampenhaus extends Component {
    constructor(props) {
        super(props);
        document.title = 'Lampenhaus';
    }

    render() {
        return (
            <Router basename={getBaseUrl()}>
                <div className="lampenhaus">
                    <Header />
                    <ErrorBoundary displayAsCard>
                        {this.props.selectedDataset &&
                            <Switch>
                                <Route exact path="/" render={() => (<Redirect to="/search/" />)} />
                                <Route path="/search/:searchTerm?" component={EmailListView} />
                                <Route path="/correspondent/:identifyingName" component={CorrespondentView} />
                                <Route path="/email/:docId" component={EmailView} />
                                <Route path="/" component={ErrorLighthouse} />
                            </Switch>
                        }
                    </ErrorBoundary>
                </div>
            </Router>
        );
    }
}

Lampenhaus.propTypes = {
    selectedDataset: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Lampenhaus);
