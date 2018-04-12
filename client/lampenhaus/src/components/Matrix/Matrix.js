import React, { Fragment, Component } from 'react';
import { Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './Matrix.css';
import './legend';
import createMatrix from './matrix-view';

const sortingOptions = ['Name', 'Number of Links', 'Region'];

class Matrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sorting: sortingOptions[0],
        };
    }

    componentDidMount() {
        createMatrix();
    }

    changeSorting(sorting) {
        this.setState({ sorting });
    }

    render() {
        return (
            <Fragment>
                <Row className="mb-3 mt-1">
                    <Col>
                        <span>Sort by:</span>
                        <UncontrolledDropdown>
                            <DropdownToggle id="order" caret>
                                {this.state.sorting}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header key="matrix-header">select sorting option</DropdownItem>
                                {sortingOptions.map(sortingOption => (
                                    <DropdownItem
                                        key={`matrix-${sortingOption}`}
                                        disabled={this.state.sorting === sortingOption}
                                        onClick={() => this.changeSorting(sortingOption)}
                                    >
                                        {sortingOption}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <select>
                            <option value="name">By Name</option>
                            <option value="count">By Number of Links</option>
                            <option value="group">By Region</option>
                        </select>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div id="matrix-container" />
                    </Col>
                </Row>
                <script type="text/javascript" src="matrix-view.js" />
            </Fragment>
        );
    }
}

export default Matrix;
