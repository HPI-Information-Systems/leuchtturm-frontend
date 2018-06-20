import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Col,
    Row,
    Card,
    CardBody,
    CardHeader,
} from 'reactstrap';
import PaginationWrapper from '../../ResultList/PaginationWrapper/PaginationWrapper';
import { updateSearchTerm } from '../../../actions/globalFilterActions';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateSearchTerm,
}, dispatch);

class CorrespondentSearchList extends Component {
    constructor(props) {
        super(props);
        this.resetSearchTerm = this.resetSearchTerm.bind(this);
    }

    resetSearchTerm() {
        // do this so that CorrespondentView is not filtered by search term right away!
        this.props.updateSearchTerm('');
    }

    render() {
        const correspondents = this.props.correspondentList.map(correspondent => (
            <Card>
                <Link to={`/correspondent/${correspondent.identifying_name}`} onClick={this.resetSearchTerm}>
                    <CardHeader tag="h4">
                        {correspondent.identifying_name}
                        {correspondent.hierarchy !== null &&
                            <div className="pull-right">
                                <FontAwesome name="sitemap" className="mr-2 text-secondary" />
                                <span className="text-secondary hierarchy-score-text">
                                    {correspondent.hierarchy}
                                </span>
                            </div>
                        }
                    </CardHeader>
                </Link>
                <CardBody>
                    <p className="text-truncate">
                        <strong>Email Addresses</strong><br />
                        {correspondent.email_addresses.length === 0 ? 'No Email Adresses found' :
                            correspondent.email_addresses.reduce((prev, curr) => `${prev}, ${curr}`)
                        }
                    </p>
                    <p className="text-truncate">
                        <strong>Aliases</strong><br />
                        {correspondent.aliases.length === 0 ? 'No Aliases found' :
                            correspondent.aliases.reduce((prev, curr) => `${prev}, ${curr}`)
                        }
                    </p>
                </CardBody>
            </Card>
        ));

        const groupedCorrespondents = correspondents.reduce((correspondent1, correspondent2, i) => {
            if (i % 2 === 0) {
                return correspondent1.concat([correspondents.slice(i, i + 2)]);
            }
            return correspondent1;
        }, []);

        const layoutedCorrespondents = groupedCorrespondents.map(twoCorrespondents => (
            <Row>
                <Col sm="6">
                    <Row>
                        <Col sm="8" className="offset-md-3">
                            {twoCorrespondents[0]}
                        </Col>
                    </Row>
                </Col>
                <Col sm="6">
                    <Row className="pull-down">
                        <Col sm="8" className="offset-md-1">
                            {twoCorrespondents[1]}
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
                                <p>
                                    {
                                        `${this.props.numberOfResults} Result${this.props.numberOfResults === 1
                                            ? '' : 's'}`
                                    }
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {layoutedCorrespondents}
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

CorrespondentSearchList.propTypes = {
    updateSearchTerm: PropTypes.func.isRequired,
    correspondentList: PropTypes.arrayOf(PropTypes.shape({
        identifying_name: PropTypes.string,
        hierarchy: PropTypes.number,
        email_addresses: PropTypes.arrayOf(PropTypes.string),
        aliases: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
    numberOfResults: PropTypes.number.isRequired,
    maxPageNumber: PropTypes.number.isRequired,
    activePageNumber: PropTypes.number.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CorrespondentSearchList));
