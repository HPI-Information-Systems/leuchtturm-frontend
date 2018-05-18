import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';

class DatasetSelector extends Component {
    constructor(props) {
        super(props);
        this.updateSelectedDataset = this.updateSelectedDataset.bind(this);
    }

    componentWillMount() {
        this.props.requestDatasets();
        const cookie = this.props.cookies.get('selectedDataset') || '';
        if (cookie !== '') {
            this.updateSelectedDataset(cookie);
        }
    }

    componentDidUpdate() {
        // to prevent updating the selected dataset when receiving data and cookie already set
        if (this.props.datasets.selectedDataset === '' && this.props.datasets.hasDatasetsData) {
            this.updateSelectedDataset(this.props.datasets.datasets[0]);
        }
    }

    updateSelectedDataset(newDataset) {
        const prevDataset = this.props.datasets.selectedDataset;
        if (newDataset !== prevDataset) {
            this.props.setSelectedDataset(newDataset);
            this.props.getDataForGlobalFilter();
        }
        if (newDataset !== this.props.cookies.get('selectedDataset')) {
            this.props.cookies.set('selectedDataset', newDataset, { path: '/' });
            this.props.history.push('/');
        }
    }

    render() {
        let datasetSelection = (
            <span>No Datasets found.</span>
        );
        if (this.props.datasets.isFetchingDatasets) {
            datasetSelection = (
                <UncontrolledDropdown>
                    <DropdownToggle caret>
                        Loading Datasets
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem> <Spinner /> </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            );
        } else if (this.props.datasets.hasDatasetsData && this.props.datasets.datasets) {
            datasetSelection = (
                <UncontrolledDropdown>
                    <DropdownToggle caret>
                        {this.props.datasets.selectedDataset}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem header key="datasets-header">Select a Dataset</DropdownItem>
                        {this.props.datasets.datasets.map(dataset => (
                            <DropdownItem
                                key={`dataset-${dataset}`}
                                disabled={dataset === this.props.datasets.selectedDataset}
                                onClick={() => this.updateSelectedDataset(dataset)}
                                className="cursor-pointer"
                            >
                                {dataset}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </UncontrolledDropdown>
            );
        }
        return (
            <div>
                { datasetSelection }
            </div>
        );
    }
}

DatasetSelector.propTypes = {
    datasets: PropTypes.shape({
        selectedDataset: PropTypes.string.isRequired,
        isFetchingDatasets: PropTypes.bool.isRequired,
        hasDatasetsData: PropTypes.bool.isRequired,
        datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    setSelectedDataset: PropTypes.func.isRequired,
    requestDatasets: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    getDataForGlobalFilter: PropTypes.func.isRequired,
};

export default withCookies(withRouter(DatasetSelector));
