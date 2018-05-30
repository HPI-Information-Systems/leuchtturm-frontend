import { combineReducers } from 'redux';
import emailListView from './emailListView';
import correspondentView from './correspondentView';
import emailView from './emailView';
import graph from './graph';
import matrix from './matrix';
import datasets from './datasets';
import globalFilter from './globalFilter';

const reducers = combineReducers({
    datasets,
    emailListView,
    correspondentView,
    emailView,
    graph,
    matrix,
    globalFilter,
});

export default reducers;
