import React, { Component } from 'react';
import { Badge, Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import './Correspondent.css';
import * as actions from '../../actions/actions';

const mapStateToProps = state => ({
    emailAddress: state.correspondent.emailAddress,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onCorrespondentViewOpened: actions.setCorrespondentEmailAddress,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class Correspondent extends Component {
    constructor(props) {
        super(props);
        props.onCorrespondentViewOpened(this.props.match.params.emailAddress);

        this.state = {
            correspondents: [
                {
                    count: 1,
                    email_address: 'Weekly_HTML.UM.A.1.3309@lists.smartmoney',
                },
                {
                    count: 2,
                    email_address: 'Navellier@InvestorPlace.com',
                },
                {
                    count: 2,
                    email_address: '40enron@enron.com',
                },
                {
                    count: 2,
                    email_address: 'weekend@ino.com',
                },
                {
                    count: 2,
                    email_address: 'Daily_News_HTML.UM.A.1.3307@lists.smartmoney',
                },
                {
                    count: 3,
                    email_address: 'bounce-otcjournal-1899244@lyris.otcjournal',
                },
                {
                    count: 4,
                    email_address: 'stocktalk@netstocks.com',
                },
                {
                    count: 4,
                    email_address: 'list@fibtrader.com',
                },
                {
                    count: 7,
                    email_address: 'morning@ino.com',
                },
                {
                    count: 11,
                    email_address: 'evening@ino.com',
                },
            ],
        };
    }

    render() {
        const correspondentElements = this.state.correspondents.map(correspondent => (
            <ListGroupItem key={correspondent.emailAddress} href={`/${correspondent.emailAddress}`}>
                <Badge color="primary" pill className="correspondent-count">
                    {correspondent.count}
                </Badge>
                {correspondent.email_address}
            </ListGroupItem>
        ));

        return (
            <Container fluid className="App">
                <Row id="correspondentHeadline">
                    <Col sm="12">
                        <h1>{this.props.emailAddress}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6">
                        <h4> Correspondents </h4>
                        <ListGroup>
                            { this.state.correspondents.length === 0
                                ? (
                                    <ListGroupItem>
                                        No correspondents found for {this.props.emailAddress}
                                    </ListGroupItem>
                                ) : correspondentElements
                            }
                        </ListGroup>
                    </Col>
                    <Col sm="6">
                        <h4> Terms </h4>
                        <ListGroup>
                            <ListGroupItem> 3 </ListGroupItem>
                            <ListGroupItem> 4 </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}

Correspondent.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            emailAddress: PropTypes.string,
        }),
    }).isRequired,
    emailAddress: PropTypes.string.isRequired,
    onCorrespondentViewOpened: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Correspondent);
