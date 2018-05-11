import { combineReducers } from 'redux';
import emailListView from './emailListView';
import correspondentView from './correspondentView';
import emailView from './emailView';
import graph from './graph';
import matrix from './matrix';
import datasets from './datasets';
import globalFilters from './globalFilters';
import sort from './sort';

const reducers = combineReducers({
    datasets,
    emailListView,
    correspondentView,
    emailView,
    graph,
    matrix,
    globalFilters,
    sort,
});

export default reducers;
