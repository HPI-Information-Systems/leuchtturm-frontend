import React, { Component } from 'react';
import { Col, Collapse, Row, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './EntityList.css';

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
            <Link to={`/search/${entity.entity}`} key={entity.entity}>
                <ListGroupItem
                    tag="button"
                    action
                >

                    {entity.entity}&nbsp;
                    <Badge color="secondary" pill>
                        {entity.entity_count}
                    </Badge>

                    <FontAwesome name="search" className="pull-right" />

                </ListGroupItem>
            </Link>
        ));

        return (
            <div>
                <Row className="collapsable-results-headline" onClick={() => this.toggleEntityList()}>
                    <Col sm="12">
                        <h6>
                            <FontAwesome name={this.state.collapsed ? 'caret-right' : 'caret-down'} className="mr-2" />
                            {this.props.entityType}
                            <Badge color="primary" pill className="entity-count">
                                {this.props.entities.length}
                            </Badge>
                        </h6>
                    </Col>
                </Row>
                <Collapse isOpen={!this.state.collapsed}>
                    <ListGroup className="entity-list-of-type">
                        {entitiesPerType}
                    </ListGroup>
                </Collapse>
                <br />
            </div>
        );
    }
}

EntityList.propTypes = {
    entities: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        entity_count: PropTypes.number.isRequired,
    })).isRequired,
    entityType: PropTypes.string.isRequired,
};

export default EntityList;
