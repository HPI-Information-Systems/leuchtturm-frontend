import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from 'reactstrap';
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
            <div className="grid-item">
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
                        <div>
                            <strong>Email Addresses</strong><br />
                            <ul className="pl-3">
                                {correspondent.email_addresses.length === 0 ? 'No Email Adresses found' :
                                    correspondent.email_addresses.slice(0, 5)
                                        .map(item => <li className="text-truncate">{item}</li>)
                                }
                            </ul>
                        </div>
                        <div>
                            <strong>Aliases</strong><br />
                            <ul className="pl-3">
                                {correspondent.aliases.length === 0 ? 'No Alias found' :
                                    correspondent.aliases.slice(0, 5)
                                        .map(item => <li className="text-truncate">{item}</li>)
                                }
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </div>
        ));

        return (
            <Fragment>
                <p className="result-number">
                    {`${this.props.numberOfResults} Result${this.props.numberOfResults === 1 ? '' : 's'}`}
                </p>
                {correspondents}
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
