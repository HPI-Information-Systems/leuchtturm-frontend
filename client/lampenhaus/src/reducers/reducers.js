import { combineReducers } from 'redux';
import emailListView from './emailListView';
import correspondentView from './correspondentView';
import emailView from './emailView';
import graph from './graph';
import datasets from './datasets';
import globalFilter from './globalFilter';

const reducers = combineReducers({
    datasets,
    emailListView,
    correspondentView,
    emailView,
    graph,
    globalFilter,
});

export default reducers;
