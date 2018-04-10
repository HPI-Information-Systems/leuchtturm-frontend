import React, { Fragment, Component } from 'react';
import {
    Collapse,
    Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './CorrespondentInfo.css';

function withLineBreaks(array) {
    return array.reduce((previous, current) => [previous, <br />, current]);
}

class CorrespondentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signaturesCollapsed: false,
        };

        this.toggleSignaturesCollapsed = this.toggleSignaturesCollapsed.bind(this);
    }

    toggleSignaturesCollapsed() {
        this.setState({ signaturesCollapsed: !this.state.signaturesCollapsed });
    }

    render() {
        let correspondentWroteTo = [];
        if (this.props.correspondentInfo.writes_to.length > 0) {
            correspondentWroteTo = this.props.correspondentInfo.writes_to.map(recipient => (
                <Link
                    to={`/correspondent/${recipient}`}
                    className="text-primary"
                    key={recipient}
                >
                    {recipient}
                </Link>
            ));
        }

        return (
            <Fragment>
                <table className="correspondent-info-table">
                    {this.props.correspondentInfo.email_address !== '' &&
                        <tr>
                            <td>Email address:</td>
                            <td>{this.props.correspondentInfo.email_address}</td>
                        </tr>
                    }
                    {this.props.correspondentInfo.aliases.length > 0 &&
                        <tr>
                            <td>Aliases:</td>
                            <td>{withLineBreaks(this.props.correspondentInfo.aliases)}</td>
                        </tr>
                    }
                    {correspondentWroteTo.length > 0 &&
                        <tr>
                            <td>Wrote to:</td>
                            <td>{withLineBreaks(correspondentWroteTo)}</td>
                        </tr>
                    }
                    {this.props.correspondentInfo.email_addresses_from_signature.length > 0 &&
                        <tr>
                            <td id="email-addresses-from-signature">
                                Email Addresses from Signatures:
                            </td>
                            <td>{withLineBreaks(this.props.correspondentInfo.email_addresses_from_signature)}</td>
                        </tr>
                    }
                    {
                        (this.props.correspondentInfo.phone_numbers_office.length > 0 ||
                        this.props.correspondentInfo.phone_numbers_fax.length > 0 ||
                        this.props.correspondentInfo.phone_numbers_cell.length > 0 ||
                        this.props.correspondentInfo.phone_numbers_home.length > 0) &&
                        <Fragment>
                            <tr>
                                <td>Phone Numbers</td>
                            </tr>
                            {this.props.correspondentInfo.phone_numbers_office.length > 0 &&
                                <tr>
                                    <td>Office:</td>
                                    <td>{withLineBreaks(this.props.correspondentInfo.phone_numbers_office)}</td>
                                </tr>
                            }
                            {this.props.correspondentInfo.phone_numbers_cell.length > 0 &&
                                <tr>
                                    <td>Cellphone:</td>
                                    <td>{withLineBreaks(this.props.correspondentInfo.phone_numbers_cell)}</td>
                                </tr>
                            }
                            {this.props.correspondentInfo.phone_numbers_fax.length > 0 &&
                                <tr>
                                    <td>Fax:</td>
                                    <td>{withLineBreaks(this.props.correspondentInfo.phone_numbers_fax)}</td>
                                </tr>
                            }
                            {this.props.correspondentInfo.phone_numbers_home.length > 0 &&
                                <tr>
                                    <td>Home:</td>
                                    <td>{withLineBreaks(this.props.correspondentInfo.phone_numbers_home)}</td>
                                </tr>
                            }
                        </Fragment>
                    }
                    <tr>
                        <td>Sources:</td>
                        <td>{this.props.correspondentInfo.source_count}</td>
                    </tr>
                    {this.props.correspondentInfo.signatures.length > 0 &&
                        <tr>
                            <td>
                                <Button
                                    color="primary"
                                    onClick={this.toggleSignaturesCollapsed}
                                    style={{ marginBottom: '1rem' }}
                                >
                                    Signatures:
                                </Button>
                            </td>
                            <td>
                                <Collapse isOpen={this.state.signaturesCollapsed}>
                                    {withLineBreaks(this.props.correspondentInfo.signatures)}
                                </Collapse>
                            </td>
                        </tr>
                    }
                </table>
            </Fragment>
        );
    }
}

CorrespondentInfo.propTypes = {
    correspondentInfo: PropTypes.shape({
        phone_numbers_office: PropTypes.arrayOf(PropTypes.string).isRequired,
        phone_numbers_cell: PropTypes.arrayOf(PropTypes.string).isRequired,
        phone_numbers_fax: PropTypes.arrayOf(PropTypes.string).isRequired,
        phone_numbers_home: PropTypes.arrayOf(PropTypes.string).isRequired,
        email_addresses_from_signature: PropTypes.arrayOf(PropTypes.string).isRequired,
        writes_to: PropTypes.arrayOf(PropTypes.string).isRequired,
        source_count: PropTypes.number,
        signatures: PropTypes.arrayOf(PropTypes.string).isRequired,
        email_address: PropTypes.string,
        aliases: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default CorrespondentInfo;
