import React, { Fragment, Component } from 'react';
import { Collapse } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import './CorrespondentInfo.css';
import Spinner from '../../Spinner/Spinner';

function withLineBreaks(array) {
    return array.reduce((previous, current) => [
        previous,
        <br key={`${previous}-br`} />,
        current]);
}

class CorrespondentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            aliasesCollapsed: false,
            aliases_from_signatureCollapsed: false,
            email_addressesCollapsed: false,
            email_addresses_from_signatureCollapsed: false,
            phoneNumbersCollapsed: false,
            signaturesCollapsed: false,
        };

        this.toggleCollapsed = this.toggleCollapsed.bind(this);
    }

    toggleCollapsed(stateKey) {
        const newState = {};
        newState[`${stateKey}Collapsed`] = !this.state[`${stateKey}Collapsed`];
        this.setState(newState);
    }

    collapseEntry(stateKey, caption) {
        return (
            this.props.correspondentInfo[stateKey].length > 0 &&
            <Fragment>
                {this.collapseHeadline(stateKey, caption)}
                <Collapse className="ml-4" isOpen={this.state[`${stateKey}Collapsed`]}>
                    {withLineBreaks(this.props.correspondentInfo[stateKey])}
                </Collapse>
            </Fragment>);
    }

    collapseHeadline(stateKey, caption) {
        return (
            <div
                role="button"
                className="collapsible-correspondent-info-headline"
                onClick={() => this.toggleCollapsed(stateKey)}
                onKeyPress={() => this.toggleCollapsed(stateKey)}
                tabIndex="0"
            >
                <FontAwesome
                    name={this.state[`${stateKey}Collapsed`]
                        ? 'caret-down' : 'caret-right'}
                    className="mr-2"
                />
                {caption}
            </div>);
    }

    render() {
        if (this.props.isFetchingCorrespondentInfo) {
            return <Spinner />;
        }
        if (this.props.hasCorrespondentInfoData) {
            let signatures = [];
            if (this.props.correspondentInfo.signatures.length > 0) {
                signatures = this.props.correspondentInfo.signatures.map(signature => (
                    <pre key={signature}>
                        {signature}
                    </pre>
                )).reduce((previous, current) => [
                    previous,
                    <Fragment key={`${previous}-fragment`}><hr /></Fragment>,
                    current]);
            }

            return (
                <div className="ml-2">
                    {this.collapseEntry('aliases', 'Aliases:')}
                    {this.collapseEntry('aliases_from_signature', 'Aliases From Signatures:')}
                    {this.collapseEntry('email_addresses', 'Email Addresses:')}
                    {this.collapseEntry('email_addresses_from_signature', 'Email Addresses From Signatures:')}
                    <table className="ml-3">
                        <tbody>
                            {this.props.correspondentInfo.hierarchy &&
                                <tr>
                                    <td><strong>Hierarchy Score:</strong></td>
                                    <td>{this.props.correspondentInfo.hierarchy}</td>
                                </tr>
                            }
                            {this.props.correspondentInfo.community &&
                                <tr>
                                    <td><strong>Community:</strong></td>
                                    <td>{this.props.correspondentInfo.community}</td>
                                </tr>
                            }
                            {this.props.correspondentInfo.role &&
                                <tr>
                                    <td><strong>Communication Role:</strong></td>
                                    <td>{this.props.correspondentInfo.role}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    {
                        (this.props.correspondentInfo.phone_numbers_office.length > 0 ||
                        this.props.correspondentInfo.phone_numbers_fax.length > 0 ||
                        this.props.correspondentInfo.phone_numbers_cell.length > 0 ||
                        this.props.correspondentInfo.phone_numbers_home.length > 0) &&
                        <Fragment>
                            {this.collapseHeadline('phoneNumbers', 'Phone Numbers:')}
                            <Collapse isOpen={this.state.phoneNumbersCollapsed}>
                                {this.props.correspondentInfo.phone_numbers_office.length > 0 &&
                                    <div className="ml-4">
                                        <strong>Office:</strong><br />
                                        <p>{withLineBreaks(this.props.correspondentInfo.phone_numbers_office)}</p>
                                    </div>
                                }
                                {this.props.correspondentInfo.phone_numbers_cell.length > 0 &&
                                    <div className="ml-4">
                                        <strong>Cellphone:</strong><br />
                                        <p>{withLineBreaks(this.props.correspondentInfo.phone_numbers_cell)}</p>
                                    </div>
                                }
                                {this.props.correspondentInfo.phone_numbers_fax.length > 0 &&
                                    <div className="ml-4">
                                        <strong>Fax:</strong><br />
                                        <p>{withLineBreaks(this.props.correspondentInfo.phone_numbers_fax)}</p>
                                    </div>
                                }
                                {this.props.correspondentInfo.phone_numbers_home.length > 0 &&
                                    <div className="ml-4">
                                        <strong>Home:</strong><br />
                                        <p>{withLineBreaks(this.props.correspondentInfo.phone_numbers_home)}</p>
                                    </div>
                                }
                            </Collapse>
                        </Fragment>
                    }
                    {signatures.length > 0 &&
                        <Fragment>
                            {this.collapseHeadline('signatures', 'Signatures:')}
                            <Collapse className="ml-4" isOpen={this.state.signaturesCollapsed}>
                                {signatures}
                            </Collapse>
                        </Fragment>
                    }
                </div>
            );
        }

        return <span>No Correspondent Info found.</span>;
    }
}

CorrespondentInfo.propTypes = {
    correspondentInfo: PropTypes.shape({
        aliases: PropTypes.arrayOf(PropTypes.string),
        aliases_from_signature: PropTypes.arrayOf(PropTypes.string),
        community: PropTypes.any,
        email_addresses: PropTypes.arrayOf(PropTypes.string),
        email_addresses_from_signature: PropTypes.arrayOf(PropTypes.string),
        hierarchy: PropTypes.any,
        identifying_name: PropTypes.string,
        numFound: PropTypes.number,
        phone_numbers_cell: PropTypes.arrayOf(PropTypes.string),
        phone_numbers_fax: PropTypes.arrayOf(PropTypes.string),
        phone_numbers_home: PropTypes.arrayOf(PropTypes.string),
        phone_numbers_office: PropTypes.arrayOf(PropTypes.string),
        role: PropTypes.any,
        signatures: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    hasCorrespondentInfoData: PropTypes.bool.isRequired,
    isFetchingCorrespondentInfo: PropTypes.bool.isRequired,
};

export default CorrespondentInfo;
