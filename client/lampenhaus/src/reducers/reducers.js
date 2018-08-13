import { combineReducers } from 'redux';
import emailListView from './emailListView';
import correspondentSearchView from './correspondentSearchView';
import correspondentView from './correspondentView';
import emailView from './emailView';
import graph from './graph';
import matrix from './matrix';
import datasets from './datasets';
import globalFilter from './globalFilter';

const reducers = combineReducers({
    datasets,
    emailListView,
    correspondentSearchView,
    correspondentView,
    emailView,
    graph,
    matrix,
    globalFilter,
});

export default reducers;
