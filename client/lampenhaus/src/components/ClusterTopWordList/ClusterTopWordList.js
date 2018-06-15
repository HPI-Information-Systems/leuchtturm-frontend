import React, { Component } from 'react';
import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';

class ClusterTopWordList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };

        this.toggleClusterTopWordList = this.toggleClusterTopWordList.bind(this);
    }

    toggleClusterTopWordList() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const wordsFromList = this.props.words.map(entity => (
            <Link to={`/search/${entity}`} key={entity}>
                <ListGroupItem
                    tag="button"
                    action
                    className="text-primary cursor-pointer"
                >
                    {entity}
                    <FontAwesome name="search" className="pull-right" />
                </ListGroupItem>
            </Link>
        ));

        if (this.props.listName === 'UNKNOWN') {
            return <span>No Words found.</span>;
        }

        return (
            <div>
                <div
                    role="button"
                    className="cursor-pointer"
                    onClick={this.toggleClusterTopWordList}
                    onKeyPress={this.toggleClusterTopWordList}
                    tabIndex="0"
                >
                    <h6>
                        <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2" />
                        {this.props.listName}
                    </h6>
                </div>
                <Collapse isOpen={!this.state.collapsed}>
                    <ListGroup>
                        {wordsFromList}
                    </ListGroup>
                </Collapse>
            </div>
        );
    }
}

ClusterTopWordList.propTypes = {
    words: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    listName: PropTypes.string.isRequired,
};

export default ClusterTopWordList;
