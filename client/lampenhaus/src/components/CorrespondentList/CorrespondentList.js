import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import './CorrespondentList.css';

class CorrespondentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            correspondentsDirection: 'all',
        };
    }

    setCorrespondentsDirection(direction) {
        this.setState({ correspondentsDirection: direction });
    }

    makeCorrespondentList(correspondents) {
        const correspondentElements = correspondents.map(correspondent => (
            <ListGroupItem key={this.state.correspondentsDirection + correspondent.email_address + correspondent.count}>
                <Link to={`/correspondent/${correspondent.email_address}`}>
                    <Badge color="primary" className="count">
                        {correspondent.count}
                    </Badge>
                    {correspondent.email_address}
                </Link>
            </ListGroupItem>
        ));
        return correspondentElements;
    }


    render() {
        let buttonGroup;
        let correspondentElements;

        if (!this.props.isFetching) {
            if (this.props.correspondents.length === 0 && this.props.correspondentsAll.length > 0) {
                buttonGroup = (
                    <Row>
                        <Col sm="12" className="text-right mb-2">
                            <ButtonGroup>
                                <Button
                                    active={this.state.correspondentsDirection === 'all'}
                                    onClick={() => this.setCorrespondentsDirection('all')}
                                    size="sm"
                                >
                                    All
                                </Button>
                                <Button
                                    active={this.state.correspondentsDirection === 'from'}
                                    onClick={() => this.setCorrespondentsDirection('from')}
                                    size="sm"
                                >
                                    From
                                </Button>
                                <Button
                                    active={this.state.correspondentsDirection === 'to'}
                                    onClick={() => this.setCorrespondentsDirection('to')}
                                    size="sm"
                                >
                                    To
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                );
            }

            if (this.props.correspondents.length === 0 && this.props.correspondentsAll.length === 0) {
                correspondentElements = (
                    <ListGroupItem>
                        No correspondents found
                    </ListGroupItem>
                );
            } else if (this.props.correspondents.length > 0) {
                correspondentElements = this.makeCorrespondentList(this.props.correspondents);
            } else if (this.state.correspondentsDirection === 'all') {
                correspondentElements = this.makeCorrespondentList(this.props.correspondentsAll);
            } else if (this.state.correspondentsDirection === 'to') {
                correspondentElements = this.makeCorrespondentList(this.props.correspondentsTo);
            } else if (this.state.correspondentsDirection === 'from') {
                correspondentElements = this.makeCorrespondentList(this.props.correspondentsFrom);
            }
        }

        return (
            <div>
                {buttonGroup}
                <Row>
                    <Col sm="12">
                        <ListGroup>
                            { this.props.isFetching
                                ? (
                                    <Spinner />
                                ) : correspondentElements
                            }
                        </ListGroup>
                    </Col>
                </Row>
            </div>
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
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })),
    correspondentsAll: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })),
    correspondentsTo: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })),
    correspondentsFrom: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })),
    isFetching: PropTypes.bool.isRequired,
};

export default CorrespondentList;
