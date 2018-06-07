import React, { Fragment, Component } from 'react';
import { withRouter } from 'react-router';
import {
    Col,
    Row,
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';

class CorrespondentSearchList extends Component {
    render() {
        return (
            <Row>
                <Col sm="4" className="offset-md-1">
                    <Card>
                        <CardHeader tag="h4" onClick={() => this.props.history.push(`/correspondent/${'Mark Paustenbach'}`)}>
                            Mark Paustenbach
                        </CardHeader>
                        <CardBody>
                            Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="4" className="offset-md-2">
                    <Card>
                        <CardHeader tag="h4" onClick={() => this.props.history.push(`/correspondent/${'Markus'}`)}>
                            Markus
                        </CardHeader>
                        <CardBody>
                            Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ip
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

CorrespondentSearchList.defaultProps = {};

CorrespondentSearchList.propTypes = {};

export default withRouter(CorrespondentSearchList);
