import React, { Component } from 'react';
import { Col, Collapse, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';

class EntityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }

    toggleEntityList() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const entitiesPerType = this.props.entities.map(entity => (
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

        return (
            <div>
                <Row className="cursor-pointer" onClick={() => this.toggleEntityList()}>
                    <Col sm="12">
                        <h6>
                            <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2" />
                            {this.props.entityType}
                        </h6>
                    </Col>
                </Row>
                <Collapse isOpen={!this.state.collapsed}>
                    <ListGroup>
                        {entitiesPerType}
                    </ListGroup>
                </Collapse>
            </div>
        );
    }
}

EntityList.propTypes = {
    entities: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    entityType: PropTypes.string.isRequired,
};

export default EntityList;
