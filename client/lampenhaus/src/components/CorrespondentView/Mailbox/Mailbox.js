import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import ResultListDumb from '../../ResultList/ResultListDumb';
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
        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={{ active: this.state.activeTab === 'all' }}
                            onClick={() => { this.toggleTab('all'); }}
                        >
                            All
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={{ active: this.state.activeTab === 'received' }}
                            onClick={() => { this.toggleTab('received'); }}
                        >
                            Received
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={{ active: this.state.activeTab === 'sent' }}
                            onClick={() => { this.toggleTab('sent'); }}
                        >
                            Sent
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab} id="mailbox-content">
                    <TabPane tabId="all">
                        <Row>
                            <Col>
                                <ResultListDumb
                                    results={this.props.allEmails}
                                    isFetching={this.props.isFetchingAllEmails}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="received">
                        <Row>
                            <Col>
                                <ResultListDumb
                                    results={this.props.receivedEmails}
                                    isFetching={this.props.isFetchingReceivedEmails}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="sent">
                        <Row>
                            <Col>
                                <ResultListDumb
                                    results={this.props.sentEmails}
                                    isFetching={this.props.isFetchingSentEmails}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        );
    }
}

Mailbox.propTypes = {
    allEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    isFetchingAllEmails: PropTypes.bool.isRequired,
    receivedEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    isFetchingReceivedEmails: PropTypes.bool.isRequired,
    sentEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    isFetchingSentEmails: PropTypes.bool.isRequired,
};


export default Mailbox;
