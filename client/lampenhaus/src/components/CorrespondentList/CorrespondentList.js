import React, { Fragment, Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import './CorrespondentList.css';

class CorrespondentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'all',
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.makeCorrespondentList = this.makeCorrespondentList.bind(this);
    }

    toggleTab(tabNumber) {
        if (this.state.activeTab !== tabNumber) {
            this.setState({ activeTab: tabNumber });
        }
    }

    makeCorrespondentList(correspondents) {
        const correspondentListItems = correspondents.map(correspondent => (
            <ListGroupItem key={this.state.activeTab + correspondent.email_address + correspondent.count}>
                <Link to={`/correspondent/${correspondent.email_address}`} className="correspondent-link">
                    <Badge color="primary" className="count">
                        {correspondent.count}
                    </Badge>
                    <span className="text-ellipsis">
                        {correspondent.email_address}
                    </span>
                </Link>
            </ListGroupItem>
        ));
        return (
            <ListGroup className="email-list-correspondents">
                {correspondentListItems}
            </ListGroup>
        );
    }


    render() {
        let tabs;
        let correspondentElements;

        if (!this.props.isFetching) {
            if (this.props.correspondents.length === 0 && this.props.correspondentsAll.length > 0) {
                tabs = (
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
                                className={this.state.activeTab === 'from' ? 'active' : ''}
                                onClick={() => { this.toggleTab('from'); }}
                            >
                                Senders
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={this.state.activeTab === 'to' ? 'active' : ''}
                                onClick={() => { this.toggleTab('to'); }}
                            >
                                Recipients
                            </NavLink>
                        </NavItem>
                    </Nav>
                );

                const correspondentElementsAll = this.makeCorrespondentList(this.props.correspondentsAll);
                const correspondentElementsTo = this.makeCorrespondentList(this.props.correspondentsTo);
                const correspondentElementsFrom = this.makeCorrespondentList(this.props.correspondentsFrom);

                correspondentElements = (
                    <TabContent activeTab={this.state.activeTab} className="correspondent-list-content">
                        <TabPane tabId="all">
                            <ListGroup>
                                {correspondentElementsAll}
                            </ListGroup>
                        </TabPane>
                        <TabPane tabId="from">
                            <ListGroup>
                                {correspondentElementsFrom}
                            </ListGroup>
                        </TabPane>
                        <TabPane tabId="to">
                            <ListGroup>
                                {correspondentElementsTo}
                            </ListGroup>
                        </TabPane>
                    </TabContent>
                );
            } else if (this.props.correspondents.length === 0 && this.props.correspondentsAll.length === 0) {
                correspondentElements = (
                    <ListGroupItem>
                        No correspondents found
                    </ListGroupItem>
                );
            } else if (this.props.correspondents.length > 0) {
                correspondentElements = this.makeCorrespondentList(this.props.correspondents);
            }
        }

        return (
            <Fragment>
                {tabs}
                { this.props.isFetching
                    ? (
                        <Spinner />
                    ) : correspondentElements
                }
            </Fragment>
        );
    }
}

CorrespondentList.defaultProps = {
    correspondents: [],
    correspondentsAll: [],
    correspondentsTo: [],
    correspondentsFrom: [],
};

CorrespondentList.propTypes = {
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number,
        email_address: PropTypes.string,
    })),
    correspondentsAll: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number,
        email_address: PropTypes.string,
    })),
    correspondentsTo: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number,
        email_address: PropTypes.string,
    })),
    correspondentsFrom: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number,
        email_address: PropTypes.string,
    })),
    isFetching: PropTypes.bool.isRequired,
};

export default CorrespondentList;
