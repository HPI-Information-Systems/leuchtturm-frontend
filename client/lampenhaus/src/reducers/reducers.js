import { combineReducers } from 'redux';
import termView from './termView';
import correspondentView from './correspondentView';
import emailView from './emailView';
import graph from './graph';
import matrix from './matrix';
import datasets from './datasets';
import globalFilter from './globalFilter';
import ApiReducer from './apiReducer';
import FilterReducer from './filterReducer';
import EventReducer from './eventReducer';
import SuggestionReducer from './suggestionReducer';

const reducers = combineReducers({
    datasets,
    termView,
    correspondentView,
    emailView,
    graph,
    matrix,
    globalFilter,
    api: ApiReducer,
    filter: FilterReducer,
    events: EventReducer,
    suggestions: SuggestionReducer,
});

export default reducers;
