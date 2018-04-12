import React, { Fragment, Component } from 'react';
import { Row, Col } from 'reactstrap';
import './Matrix.css';
import createMatrix from './matrix-view';

// const sortingOptions = [
//     {
//         name: 'Name',
//         key: 'name',
//     }, {
//         name: 'Number of Links',
//         key: 'count',
//     }, {
//         name: 'Region',
//         key: 'group',
//     }];

// function getSortingName(sortingKey) {
//     let sortingName = 'Unknown Sorting Key';
//     sortingOptions.forEach((sortingOption) => {
//         if (sortingOption.key === sortingKey) {
//             sortingName = sortingOption.name;
//         }
//     });
//     return sortingName;
// }

class Matrix extends Component {
    // constructor(props) {
    //     super(props);
    //     // this.state = {
    //     //     sorting: sortingOptions[0].key,
    //     // };
    // }

    componentDidMount() {
        createMatrix();
    }

    // changeSorting(sorting) {
    //     this.setState({ sorting });
    // }

    render() {
        return (
            <Fragment>
                <Row className="mb-3 mt-1">
                    <Col>
                        <div id="matrix-selection-container">
                            <span id="matrix-selection-text">Sort by:</span>
                            {/* <UncontrolledDropdown size="sm">
                                <DropdownToggle caret>
                                    {getSortingName(this.state.sorting)}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem header key="matrix-header">select sorting option</DropdownItem>
                                    {sortingOptions.map(sortingOption => (
                                        <DropdownItem
                                            key={`matrix-sort-${sortingOption.key}`}
                                            disabled={this.state.sorting === sortingOption.key}
                                            onClick={() => this.changeSorting(sortingOption.key)}
                                        >
                                            {sortingOption.name}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </UncontrolledDropdown> */}
                            <select id="order">
                                <option value="name">By Name</option>
                                <option value="count">By Number of Links</option>
                                <option value="group">By Region</option>
                            </select>
                        </div>
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
