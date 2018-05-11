import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getBaseUrl } from '../../utils/environment';
import '../../assets/global.css';
import './Lampenhaus.css';
import EmailListView from '../EmailListView/EmailListView';
import EmailView from '../EmailView/EmailView';
import CorrespondentView from '../CorrespondentView/CorrespondentView';
import Header from '../Header/Header';

const mapStateToProps = state => ({
    selectedDataset: state.datasets.selectedDataset,
});

function Lampenhaus(props) {
    return (
        <Router basename={getBaseUrl()}>
            <div className="lampenhaus">
                <Header />
                {props.selectedDataset !== '' &&
                    <React.Fragment>
                        <Route exact path="/" render={() => (<Redirect to="/search/" />)} />
                        <Route path="/search/:searchTerm?" component={EmailListView} />
                        <Route path="/correspondent/:emailAddress" component={CorrespondentView} />
                        <Route path="/email/:docId" component={EmailView} />
                    </React.Fragment>
                }
            </div>
        </Router>
    );
}

Lampenhaus.propTypes = {
    selectedDataset: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Lampenhaus);
