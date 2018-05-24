import React, { Component } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
} from 'reactstrap';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import ResultList from '../../ResultList/ResultList';
import Spinner from '../../Spinner/Spinner';
import './EmailListCard.css';

class EmailListCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dropdownOpen: false,
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    toggleDropdown() {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    render() {
        return this.props.emailList.hasRequestError ? (
            <Card className="email-list">
                <CardHeader tag="h4">E-Mails</CardHeader>
                <CardBody className="text-danger">
                    An error occurred while requesting the E-Mails.
                </CardBody>
            </Card>
        ) : (
            <Card className="email-list">
                <CardHeader tag="h4">
                    E-Mails
                    {!this.props.emailList.isFetching && this.props.emailList.number > 0 &&
                    <div className="pull-right">
                        <div className="email-count mr-2 small d-inline-block">
                            {this.props.emailList.number} E-Mails
                        </div>
                        <Dropdown
                            isOpen={this.state.dropdownOpen}
                            toggle={this.toggleDropdown}
                            size="sm"
                            className="d-inline-block sort mr-2"
                        >
                            <DropdownToggle caret>
                                {this.props.emailList.sortation || 'Relevance'}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>Sort by</DropdownItem>
                                <DropdownItem
                                    onClick={() => this.props.setSortation('Relevance')}
                                >
                                    Relevance
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => this.props.setSortation('Newest first')}
                                >
                                    Newest first
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => this.props.setSortation('Oldest first')}
                                >
                                    Oldest first
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <FontAwesome
                            className="blue-button"
                            name={this.props.isMaximized ? 'times' : 'arrows-alt'}
                            onClick={this.props.toggleMaximize}
                        />
                    </div>
                    }
                </CardHeader>
                <CardBody>
                    {this.props.emailList.isFetching && <Spinner />}
                    {!this.props.emailList.isFetching && this.props.emailList.number > 0 &&
                    <ResultList
                        results={this.props.emailList.results}
                        numberOfResults={this.props.emailList.number}
                        resultsPerPage={this.props.resultsPerPage}
                        maxPageNumber={Math.ceil(this.props.emailList.number / this.props.resultsPerPage)}
                        onPageNumberChange={this.props.onPageNumberChange}
                        activePageNumber={this.props.activePageNumber}
                    />
                    }
                    {!this.props.emailList.isFetching && this.props.emailList.number === 0 &&
                    'No E-Mails found.'}
                </CardBody>
            </Card>
        );
    }
}

EmailListCard.propTypes = {
    setSortation: PropTypes.func.isRequired,
    onPageNumberChange: PropTypes.func.isRequired,
    toggleMaximize: PropTypes.func.isRequired,
    emailList: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        hasRequestError: PropTypes.bool.isRequired,
        results: PropTypes.array.isRequired,
        number: PropTypes.number.isRequired,
        sortation: PropTypes.string.isRequired,
    }).isRequired,
    resultsPerPage: PropTypes.number.isRequired,
    activePageNumber: PropTypes.number.isRequired,
    isMaximized: PropTypes.bool.isRequired,
};

export default EmailListCard;
