import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { withRouter } from 'react-router';
import {
    Col,
    Row,
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import PaginationWrapper from "../../ResultList/PaginationWrapper/PaginationWrapper";

class CorrespondentSearchList extends Component {
    render() {
        const correspondents = this.props.correspondentList.map(correspondent => (
            <Card>
                <Link to={`/correspondent/${correspondent.identifying_name}`}>
                    <CardHeader tag="h4">
                        {correspondent.identifying_name}
                        {correspondent.hierarchy !== null &&
                            <div className="pull-right">
                                <FontAwesome name="sitemap" className="mr-2 text-secondary"/>
                                <span className="text-secondary hierarchy-score-text">
                                    {correspondent.hierarchy}
                                </span>
                            </div>
                        }
                    </CardHeader>
                </Link>
                <CardBody>
                        <p className="text-truncate">
                            <strong>Email Addresses</strong><br/>
                            {correspondent.email_addresses.length == 0 ? 'No Email Adresses found' :
                                correspondent.email_addresses.reduce((prev, curr) => `${prev}, ${curr}`)
                            }
                        </p>
                        <p className="text-truncate">
                            <strong>Aliases</strong><br/>
                            {correspondent.aliases.length == 0 ? 'No Aliases found' :
                                correspondent.aliases.reduce((prev, curr) => `${prev}, ${curr}`)
                            }
                        </p>
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
                <Col sm="6">
                    <Row>
                        <Col sm="8" className="offset-md-3">
                            {two_correspondents[0]}
                        </Col>
                    </Row>
                </Col>
                <Col sm="6">
                    <Row className="pull-down">
                        <Col sm="8" className="offset-md-1">
                            {two_correspondents[1]}
                        </Col>
                    </Row>
                </Col>
            </Row>
        ));

        return (
            <Fragment>
                <Row>
                    <Col sm="6">
                        <Row>
                            <Col sm="8" className="offset-md-3">
                                <p> {`${this.props.numberOfResults} Result${this.props.numberOfResults === 1 ? '' : 's'}`}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {layouted_correspondents}
                {this.props.maxPageNumber > 1 &&
                    <PaginationWrapper
                        activePageNumber={this.props.activePageNumber}
                        maxPageNumber={this.props.maxPageNumber}
                        onPageNumberChange={this.props.onPageNumberChange}
                    />
                }
            </Fragment>
        );
    }
}

CorrespondentSearchList.defaultProps = {};

CorrespondentSearchList.propTypes = {};

export default withRouter(CorrespondentSearchList);
