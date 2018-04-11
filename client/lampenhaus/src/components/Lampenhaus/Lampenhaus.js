import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import getBaseUrl from '../../utils/environment';
import '../../assets/global.css';
import './Lampenhaus.css';
import FullTextSearch from '../TermView/TermView';
import EmailView from '../EmailView/EmailView';
import CorrespondentView from '../CorrespondentView/CorrespondentView';
import Header from '../Header/Header';
import Matrix from '../Matrix/Matrix';

const mapStateToProps = state => ({
    selectedDataset: state.datasets.selectedDataset,
});

class Lampenhaus extends Component {
    componentDidMount() {
        document.title = 'Lampenhaus';
    }

    render() {
        return (
            <Router basename={getBaseUrl()}>
                <div className="lampenhaus">
                    <Header />
                    <Matrix />
                    {this.props.selectedDataset !== '' &&
                        <React.Fragment>
                            <Route path="/search/:searchTerm" component={FullTextSearch} />
                            <Route path="/correspondent/:emailAddress" component={CorrespondentView} />
                            <Route path="/email/:docId" component={EmailView} />
                        </React.Fragment>
                    }
                </div>
            </Router>
        );
    }
}

Lampenhaus.propTypes = {
    selectedDataset: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Lampenhaus);
