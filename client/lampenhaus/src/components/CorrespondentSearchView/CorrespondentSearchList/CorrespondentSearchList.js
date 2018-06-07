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
        const correspondents = this.props.correspondentList.map(correspondent => (
            <Card>
                <CardHeader tag="h4" onClick={() => this.props.history.push(`/correspondent/${correspondent.identifying_name}`)}>
                    {correspondent.identifying_name}
                </CardHeader>
                <CardBody>
                    {correspondent.email_addresses.length > 0 && <p>Email Addresses: {correspondent.email_addresses}</p>}
                    {correspondent.hierarchy !== null && <p>Hierarchy Score: {correspondent.hierarchy}</p>}
                    {correspondent.aliases.length > 0 && <p>Aliases: {correspondent.aliases}</p>}
                </CardBody>
            </Card>
        ));

        const grouped_correspondents = correspondents.reduce((correspondent1, correspondent2, i) => {
            if (i % 2 === 0) {
                return correspondent1.concat([correspondents.slice(i, i + 2)]);
            } else {
                return correspondent1;
            }
        }, []);

        const layouted_correspondents = grouped_correspondents.map(two_correspondents => (
            <Row>
                <Col sm="4" className="offset-md-1">
                    {two_correspondents[0]}
                </Col>
                <Col sm="4" className="offset-md-2">
                    {two_correspondents[1]}
                </Col>
            </Row>
        ));

        return (
            <Fragment>
                {layouted_correspondents}
            </Fragment>
        );
    }
}

CorrespondentSearchList.defaultProps = {};

CorrespondentSearchList.propTypes = {};

export default withRouter(CorrespondentSearchList);
