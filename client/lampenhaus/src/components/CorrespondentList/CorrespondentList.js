import React, { Component } from 'react';
import { Container, Row, Col, ButtonGroup, Button, Badge, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import './CorrespondentList.css';

// eslint-disable-next-line react/prefer-stateless-function
class CorrespondentList extends Component {
    render() {
        let correspondentElements;

        if (!this.props.isFetching) {
            if (this.props.correspondents.all.length === 0) {
                correspondentElements = (
                    <ListGroupItem>
                        No correspondents found
                    </ListGroupItem>
                );
            } else {
                const correspondents = this.props.correspondents[this.props.showCorrespondentsDirection];
                correspondentElements = correspondents.map(correspondent => (
                    <ListGroupItem key={correspondent.email_address}>
                        <Link to={`/correspondent/${correspondent.email_address}`}>
                            <Badge color="primary" className="count">
                                {correspondent.count}
                            </Badge>
                            {correspondent.email_address}
                        </Link>
                    </ListGroupItem>
                ));
            }
        }

        return (
            <Container fluid>
                <Row>
                    <Col sm="12" className="text-right">
                        <ButtonGroup>
                            <Button
                                active={this.props.showCorrespondentsDirection === 'all'}
                                onClick={() => this.props.setShowCorrespondentsDirection('all')}
                                size="sm"
                            >
                                All
                            </Button>
                            <Button
                                active={this.props.showCorrespondentsDirection === 'from'}
                                onClick={() => this.props.setShowCorrespondentsDirection('from')}
                                size="sm"
                            >
                                From
                            </Button>
                            <Button
                                active={this.props.showCorrespondentsDirection === 'to'}
                                onClick={() => this.props.setShowCorrespondentsDirection('to')}
                                size="sm"
                            >
                                To
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
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
            </Container>
        );
    }
}

CorrespondentList.propTypes = {
    correspondents: PropTypes.shape({
        all: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number.isRequired,
            email_address: PropTypes.string.isRequired,
        })).isRequired,
        to: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number.isRequired,
            email_address: PropTypes.string.isRequired,
        })).isRequired,
        from: PropTypes.arrayOf(PropTypes.shape({
            count: PropTypes.number.isRequired,
            email_address: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
    isFetching: PropTypes.bool.isRequired,
    showCorrespondentsDirection: PropTypes.string.isRequired,
    setShowCorrespondentsDirection: PropTypes.func.isRequired,
};

export default CorrespondentList;
