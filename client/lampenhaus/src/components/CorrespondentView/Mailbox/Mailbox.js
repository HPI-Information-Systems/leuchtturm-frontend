import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ResultListDumb from '../../ResultList/ResultListDumb';
import './Mailbox.css';

// eslint-disable-next-line
class Mailbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
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
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggleTab('1'); }}
                        >
                            All
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggleTab('2'); }}
                        >
                            Received
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggleTab('3'); }}
                        >
                            Sent
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col>
                                <ResultListDumb
                                    results={this.props.allEmails}
                                    isFetching={this.props.isFetchingAllEmails}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col>
                                <ResultListDumb
                                    results={this.props.receivedEmails}
                                    isFetching={this.props.isFetchingReceivedEmails}
                                />
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
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
            date: PropTypes.number.isRequired,
        }).isRequired,
    })).isRequired,
    isFetchingAllEmails: PropTypes.bool.isRequired,
    receivedEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.number.isRequired,
        }).isRequired,
    })).isRequired,
    isFetchingReceivedEmails: PropTypes.bool.isRequired,
    sentEmails: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.string.isRequired,
        doc_id: PropTypes.string.isRequired,
        header: PropTypes.shape({
            subject: PropTypes.string.isRequired,
            date: PropTypes.number.isRequired,
        }).isRequired,
    })).isRequired,
    isFetchingSentEmails: PropTypes.bool.isRequired,
};


export default Mailbox;
