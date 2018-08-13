import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';
import ResultListDumb from '../../ResultList/ResultListDumb';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import './Mailbox.css';

class Mailbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'all',
        };
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tabNumber) {
        if (this.state.activeTab !== tabNumber) {
            this.setState({ activeTab: tabNumber });
        }
    }

    render() {
        if (this.props.allEmails.isFetching &&
            this.props.receivedEmails.isFetching &&
            this.props.sentEmails.isFetching) {
            return <Spinner />;
        }
        return (
            <div className="mailbox-wrapper">
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={this.state.activeTab === 'all' ? 'active' : ''}
                            onClick={() => { this.toggleTab('all'); }}
                        >
                            All
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={this.state.activeTab === 'received' ? 'active' : ''}
                            onClick={() => { this.toggleTab('received'); }}
                        >
                            Received
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={this.state.activeTab === 'sent' ? 'active' : ''}
                            onClick={() => { this.toggleTab('sent'); }}
                        >
                            Sent
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab} className="mailbox-content">
                    <TabPane tabId="all">
                        <ErrorBoundary title="Something went wrong with All Emails.">
                            {this.props.allEmails.hasRequestError ?
                                <span className="text-danger">
                                    An error occurred while requesting All Emails.
                                </span> :
                                <ResultListDumb
                                    results={this.props.allEmails.data}
                                    isFetching={this.props.allEmails.isFetching}
                                />}
                        </ErrorBoundary>
                    </TabPane>
                    <TabPane tabId="received">
                        <ErrorBoundary title="Something went wrong with Received Emails.">
                            {this.props.receivedEmails.hasRequestError ?
                                <span className="text-danger">
                                    An error occurred while requesting Received Emails.
                                </span> :
                                <ResultListDumb
                                    results={this.props.receivedEmails.data}
                                    isFetching={this.props.receivedEmails.isFetching}
                                />}
                        </ErrorBoundary>
                    </TabPane>
                    <TabPane tabId="sent">
                        <ErrorBoundary title="Something went wrong with Sent Emails.">
                            {this.props.sentEmails.hasRequestError ?
                                <span className="text-danger">
                                    An error occurred while requesting Sent Emails.
                                </span> :
                                <ResultListDumb
                                    results={this.props.sentEmails.data}
                                    isFetching={this.props.sentEmails.isFetching}
                                />}
                        </ErrorBoundary>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

Mailbox.propTypes = {
    allEmails: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            body: PropTypes.string.isRequired,
            doc_id: PropTypes.string.isRequired,
            header: PropTypes.shape({
                subject: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
    sentEmails: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            body: PropTypes.string.isRequired,
            doc_id: PropTypes.string.isRequired,
            header: PropTypes.shape({
                subject: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
    receivedEmails: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasData: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        data: PropTypes.arrayOf(PropTypes.shape({
            body: PropTypes.string.isRequired,
            doc_id: PropTypes.string.isRequired,
            header: PropTypes.shape({
                subject: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }).isRequired,
        })).isRequired,
    }).isRequired,
};


export default Mailbox;
