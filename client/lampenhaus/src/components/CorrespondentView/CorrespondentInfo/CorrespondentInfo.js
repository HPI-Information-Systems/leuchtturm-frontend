import React, { Fragment, Component } from 'react';
import { Collapse } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import './CorrespondentInfo.css';
import Spinner from '../../Spinner/Spinner';

function withLines(array) {
    return array.map(element => (element ? <Fragment key={`${element}-frag`}><hr />{element}</Fragment> : ''));
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
            this.props.correspondentInfo[stateKey]
            && this.props.correspondentInfo[stateKey].length > 0 &&
            <Fragment>
                {this.collapseHeadline(stateKey, caption)}
                <Collapse className="ml-3 mr-3" isOpen={this.state[`${stateKey}Collapsed`]}>
                    {withLines(this.props.correspondentInfo[stateKey])}
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

    hasPhoneNumbers(key) {
        return this.props.correspondentInfo[`phone_numbers_${key}`]
        && this.props.correspondentInfo[`phone_numbers_${key}`].length > 0;
    }

    render() {
        if (this.props.isFetchingCorrespondentInfo) {
            return <Spinner />;
        }
        if (this.props.hasCorrespondentInfoData && this.props.correspondentInfo.numFound > 0) {
            let signatures = [];
            if (this.props.correspondentInfo.signatures
                && this.props.correspondentInfo.signatures.length > 0) {
                signatures = this.props.correspondentInfo.signatures.map((signature) => {
                    if (signature) {
                        return (
                            <Fragment key={`${signature}-fragment`}>
                                <hr />
                                <pre key={signature}>
                                    {signature}
                                </pre>
                            </Fragment>);
                    }
                    return signature;
                });
            }

            return (
                <div className="info-content">
                    <table className="hierarchy-table">
                        <tbody>
                            {this.props.correspondentInfo.organisation &&
                                <tr>
                                    <td>Organisation</td>
                                    <td>{this.props.correspondentInfo.organisation}</td>
                                </tr>
                            }
                            {this.props.correspondentInfo.hierarchy > -1 &&
                                <tr>
                                    <td>Hierarchy Score</td>
                                    <td>{this.props.correspondentInfo.hierarchy}</td>
                                </tr>
                            }
                            {this.props.correspondentInfo.community > -1 &&
                                <tr>
                                    <td>Community</td>
                                    <td>{this.props.correspondentInfo.community}</td>
                                </tr>
                            }
                            {this.props.correspondentInfo.role > -1 &&
                                <tr>
                                    <td>Communication Role</td>
                                    <td>{this.props.correspondentInfo.role}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                    {this.collapseEntry('aliases', 'Aliases')}
                    {this.collapseEntry('aliases_from_signature', 'Aliases From Signatures')}
                    {this.collapseEntry('email_addresses', 'Email Addresses')}
                    {this.collapseEntry('email_addresses_from_signature', 'Email Addresses From Signatures')}
                    {(this.hasPhoneNumbers('office')
                        || this.hasPhoneNumbers('fax')
                        || this.hasPhoneNumbers('cell')
                        || this.hasPhoneNumbers('home')) &&
                            <Fragment>
                                {this.collapseHeadline('phoneNumbers', 'Phone Numbers')}
                                <Collapse isOpen={this.state.phoneNumbersCollapsed}>
                                    {this.hasPhoneNumbers('office') &&
                                        <div className="ml-3 phone-numbers">
                                            <div className="phone-type">Office</div>
                                            <div className="phone-entries mr-1">
                                                {withLines(this.props.correspondentInfo.phone_numbers_office)}
                                            </div>
                                        </div>
                                    }
                                    {this.hasPhoneNumbers('cell') &&
                                        <div className="ml-3 phone-numbers">
                                            <div className="phone-type">Cellphone</div>
                                            <div className="phone-entries mr-1">
                                                {withLines(this.props.correspondentInfo.phone_numbers_cell)}
                                            </div>
                                        </div>
                                    }
                                    {this.hasPhoneNumbers('fax') &&
                                        <div className="ml-3 phone-numbers">
                                            <div className="phone-type">Fax</div>
                                            <div className="phone-entries mr-1">
                                                {withLines(this.props.correspondentInfo.phone_numbers_fax)}
                                            </div>
                                        </div>
                                    }
                                    {this.hasPhoneNumbers('home') &&
                                        <div className="ml-3 phone-numbers">
                                            <div className="phone-type">Home</div>
                                            <div className="phone-entries mr-1">
                                                {withLines(this.props.correspondentInfo.phone_numbers_home)}
                                            </div>
                                        </div>
                                    }
                                </Collapse>
                            </Fragment>
                    }
                    {signatures.length > 0 &&
                        <Fragment>
                            {this.collapseHeadline('signatures', 'Signatures')}
                            <Collapse className="ml-3 mr-3" isOpen={this.state.signaturesCollapsed}>
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
        organisation: PropTypes.string,
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
