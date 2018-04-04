
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withRouter } from 'react-router';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes, { instanceOf } from 'prop-types';
import * as actions from '../../../actions/actions';
import Spinner from '../../Spinner/Spinner';
import './DatasetSelector.css';

const mapStateToProps = state => ({
    isFetchingDatasets: state.datasets.isFetchingDatasets,
    hasDatasetsData: state.datasets.hasDatasetsData,
    datasets: state.datasets.datasets,
    selectedDataset: state.datasets.selectedDataset,
    hasSelectedDataset: state.datasets.hasSelectedDataset,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    selectDataset: actions.selectDataset,
    requestDatasets: actions.requestDatasets,
}, dispatch);

class DatasetSelector extends Component {
    constructor(props) {
        super(props);
        this.updateSelectedDataset = this.updateSelectedDataset.bind(this);
    }

    componentWillMount() {
        this.props.requestDatasets(true);
        const cookie = this.props.cookies.get('selectedDataset') || '';
        if (cookie !== '') {
            this.updateSelectedDataset(cookie);
        }
    }

    componentDidUpdate() {
        // to prevent updating the selected dataset when receiving the data the first time
        if (!this.props.hasSelectedDataset && this.props.hasDatasetsData) {
            this.updateSelectedDataset(this.props.datasets[0]);
        }
    }

    updateSelectedDataset(newDataset) {
        const prevDataset = this.props.selectedDataset;
        if (newDataset !== prevDataset) {
            this.props.selectDataset(newDataset);
        }
        if (newDataset !== this.props.cookies.get('selectedDataset')) {
            this.props.cookies.set('selectedDataset', newDataset, { path: '/' });
            this.props.history.push('/');
        }
    }

    render() {
        let datasetSelection = (
            <span>No configured Datasets found.</span>
        );
        if (this.props.isFetchingDatasets) {
            datasetSelection = (
                <Spinner />
            );
        } else if (this.props.hasDatasetsData && this.props.datasets) {
            datasetSelection = (
                <UncontrolledDropdown>
                    <DropdownToggle caret>
                        {this.props.selectedDataset}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Select a Dataset</DropdownItem>
                        {this.props.datasets.map(dataset => (
                            <DropdownItem
                                disabled={dataset === this.props.selectedDataset}
                                onClick={() => this.updateSelectedDataset(dataset)}
                            >
                                {dataset}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </UncontrolledDropdown>
            );
        }
        return (
            <div className="dataselection-container">
                <span>Selected Dataset: </span>
                { datasetSelection }
            </div>
        );
    }
}

DatasetSelector.propTypes = {
    selectDataset: PropTypes.func.isRequired,
    selectedDataset: PropTypes.string.isRequired,
    requestDatasets: PropTypes.func.isRequired,
    isFetchingDatasets: PropTypes.bool.isRequired,
    hasDatasetsData: PropTypes.bool.isRequired,
    hasSelectedDataset: PropTypes.bool.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.string).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func,
    }).isRequired,
    cookies: instanceOf(Cookies).isRequired,
};

export default withCookies(withRouter(connect(mapStateToProps, mapDispatchToProps)(DatasetSelector)));
