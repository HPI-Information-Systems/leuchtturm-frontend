import React, { Component } from 'react';
import {
    Col,
    Container,
    Row,
    Card,
    CardBody,
    CardHeader,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CorrespondentList from './CorrespondentList/CorrespondentList';
import TermList from './TermList/TermList';
import GraphView from '../GraphView/GraphView';
import './CorrespondentView.css';
import * as actions from '../../actions/actions';
import CommunicationList from './CommunicationList/CommunicationList';
import Spinner from '../Spinner/Spinner';

const mapStateToProps = state => ({
    emailAddress: state.correspondent.emailAddress,
    correspondents: state.correspondent.correspondents,
    isFetchingCorrespondents: state.correspondent.isFetchingCorrespondents,
    terms: state.correspondent.terms,
    isFetchingTerms: state.correspondent.isFetchingTerms,
    communication: state.correspondent.communication,
    isFetchingCommunication: state.correspondent.isFetchingCommunication,
    hasCommunicationData: state.correspondent.hasCommunicationData,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onCorrespondentEmailAddressUpdated: actions.setCorrespondentEmailAddress,
    getTerms: actions.requestTerms,
    getCorrespondents: actions.requestCorrespondents,
    getCommunication: actions.requestCommunication,
}, dispatch);

// eslint-disable-next-line react/prefer-stateless-function
class CorrespondentView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: true,
        };
        const { emailAddress } = props.match.params;
        // FYI: CorrespondentView object has prop match.params because
        // its parent is assumed to be a <Route> of react-router-dom
        props.onCorrespondentEmailAddressUpdated(emailAddress);
        //props.getTerms(emailAddress);
        //props.getCorrespondents(emailAddress);

        this.toggleModalOpen = this.toggleModalOpen.bind(this);
        this.getCommunicationData = this.getCommunicationData.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.didCorrespondentEmailChange(prevProps)) {
            const { emailAddress } = this.props.match.params;
            this.props.onCorrespondentEmailAddressUpdated(emailAddress);
            this.props.getTerms(emailAddress);
            this.props.getCorrespondents(emailAddress);
        }
    }

    didCorrespondentEmailChange(prevProps) {
        return prevProps.match.params.emailAddress !== this.props.match.params.emailAddress;
    }

    toggleModalOpen() {
        this.setState({ modalOpen: !this.state.modalOpen });
    }

    getCommunicationData(query) {
        this.props.getCommunication(query);
        this.toggleModalOpen();
    }

    render() {
        return (
            <Container fluid className="App">
                <Row id="correspondentHeadline">
                    <Col sm="12">
                        <h2>{this.props.emailAddress}</h2>
                    </Col>
                </Row>
                <Row className="correspondent-lists">
                    <Col sm="6">
                        <Card>
                            <CardHeader tag="h4">Correspondents</CardHeader>
                            <CardBody>
                                <CorrespondentList
                                    emailAddress={this.props.emailAddress}
                                    correspondents={this.props.correspondents}
                                    isFetching={this.props.isFetchingCorrespondents}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card>
                            <CardHeader tag="h4">Terms</CardHeader>
                            <CardBody>
                                <TermList
                                    emailAddress={this.props.emailAddress}
                                    terms={this.props.terms}
                                    isFetching={this.props.isFetchingTerms}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <CardBody>
                                <GraphView
                                    emailAddress={this.props.emailAddress}
                                    updateBrowserCorrespondentPath={this.props.updateBrowserCorrespondentPath}
                                    getCommunication={this.getCommunicationData}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    isOpen={this.state.isOpen}
                    toggle={this.toggleModalOpen}
                    className="modal-lg"
                >
                    <ModalHeader toggle={this.toggleModalOpen}>
                        Correspondence
                    </ModalHeader>
                    <ModalBody>
                        {this.props.isFetchingCommunication &&
                        <Spinner />
                        }
                        {this.props.hasCommunicationData &&
                        <CommunicationList
                            communication={this.props.communication}
                            numberOfEmails={this.props.numberOfEmails}
                        />
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModalOpen}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}

CorrespondentView.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            emailAddress: PropTypes.string,
        }),
    }).isRequired,
    correspondents: PropTypes.arrayOf(PropTypes.shape({
        count: PropTypes.number.isRequired,
        email_address: PropTypes.string.isRequired,
    })).isRequired,
    terms: PropTypes.arrayOf(PropTypes.shape({
        entity: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    communication: PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.arrayOf(PropTypes.string.isRequired),
        raw: PropTypes.arrayOf(PropTypes.string.isRequired),
        doc_id: PropTypes.arrayOf(PropTypes.string.isRequired),
        entities: PropTypes.object,
    })).isRequired,
    numberOfEmails: PropTypes.number.isRequired,
    emailAddress: PropTypes.string.isRequired,
    onCorrespondentEmailAddressUpdated: PropTypes.func.isRequired,
    updateBrowserCorrespondentPath: PropTypes.func.isRequired,
    getCorrespondents: PropTypes.func.isRequired,
    isFetchingCorrespondents: PropTypes.bool.isRequired,
    getTerms: PropTypes.func.isRequired,
    isFetchingTerms: PropTypes.bool.isRequired,
    getCommunication: PropTypes.func.isRequired,
    isFetchingCommunication: PropTypes.bool.isRequired,
    hasCommunicationData: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CorrespondentView);
