import React, { Fragment, Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { select } from 'd3';
import FontAwesome from 'react-fontawesome';
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
            <ListGroupItem
                key={this.state.activeTab + correspondent.identifying_name + correspondent.count}
                onMouseEnter={() => {
                    if (correspondent.mail_list) {
                        correspondent.mail_list.forEach((mail) => {
                            select(`circle[data-highlight='${mail}']`).attr('r', '6').attr('fill', 'red');
                        });
                    }
                }}
                onMouseLeave={() => {
                    if (correspondent.mail_list) {
                        correspondent.mail_list.forEach((mail) => {
                            select(`circle[data-highlight='${mail}']`).attr('r', '3').attr('fill', 'rgba(0, 0, 0)');
                        });
                    }
                }}
            >
                <Link to={`/correspondent/${correspondent.identifying_name}`} className="correspondent-link">
                    <span className="count text-primary badge">
                        {correspondent.count}
                    </span>
                    <span className="text-truncate correspondent-name mr-1">
                        {correspondent.identifying_name}
                    </span>
                    <p className="list-badge small community mr-2 mb-0">Community: {correspondent.community}</p>
                    <p className="list-badge small role mr-2 mb-0">{correspondent.role}</p>
                    <FontAwesome name="sitemap" className="mr-2 text-secondary" />
                    <span className="text-secondary small hierarchy-score-text">
                        {correspondent.hierarchy}
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

                correspondentElements = (
                    <TabContent activeTab={this.state.activeTab} className="correspondent-list-content">
                        <TabPane tabId="all">
                            { this.makeCorrespondentList(this.props.correspondentsAll) }
                        </TabPane>
                        <TabPane tabId="from">
                            { this.makeCorrespondentList(this.props.correspondentsFrom) }
                        </TabPane>
                        <TabPane tabId="to">
                            { this.makeCorrespondentList(this.props.correspondentsTo) }
                        </TabPane>
                    </TabContent>
                );
            } else if (this.props.correspondents.length === 0 && this.props.correspondentsAll.length === 0) {
                correspondentElements = 'No correspondents found.';
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
        identifying_name: PropTypes.string,
    })),
    correspondentsAll: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number,
        identifying_name: PropTypes.string,
    })),
    correspondentsTo: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number,
        identifying_name: PropTypes.string,
    })),
    correspondentsFrom: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number,
        identifying_name: PropTypes.string,
    })),
    isFetching: PropTypes.bool.isRequired,
};

export default CorrespondentList;
